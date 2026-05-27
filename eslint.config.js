import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
// 新增 Prettier 相关导入
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            // 注意：eslint-config-prettier 必须放在最后，以覆盖其他规则中的格式冲突
            prettierConfig,
        ],
        plugins: {
            // 注册 prettier 插件
            prettier: prettierPlugin,
        },
        rules: {
            // 让 Prettier 的格式问题作为 ESLint 错误显示，并自动修复（--fix 时）
            'prettier/prettier': 'error',
            'typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
            'no-useless-assignment': 'off', // 关闭无用赋值检查，允许某些特定场景的赋值
        },
        languageOptions: {
            globals: globals.browser,
        },
    },
])
