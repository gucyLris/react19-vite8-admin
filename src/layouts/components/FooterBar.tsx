import { useCommonStore } from '@/hooks/useCommonStore'

export const FooterBar = () => {
    const { bgClass, textClass } = useCommonStore()

    return (
        <div
            className={`flex h-10 items-center justify-center ${bgClass} ${textClass} shadow-[inset_0px_-4px_14px_0px_rgba(0,0,0,0.3)]`}
        >
            © 2026 醉后不知天在水，满船清梦压星河
        </div>
    )
}
