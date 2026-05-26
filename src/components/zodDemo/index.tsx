import { z } from 'zod'

// 定义一个用户对象的 schema
const UserSchema = z.object({
    name: z.string(),
    age: z.number().int().positive(),
})

export const ZodDemo = () => {
    let user: z.infer<typeof UserSchema> | null = null

    try {
        user = UserSchema.parse({ name: 'John', age: 18 })
        console.log('验证成功:', user)
    } catch (error: unknown) {
        console.error('验证失败:', error)
    }

    if (!user) {
        return <div>验证失败</div>
    }

    return <div>{user.name}</div>
}
