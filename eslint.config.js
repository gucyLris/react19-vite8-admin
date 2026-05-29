import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
// 新增：导入 simple-import-sort 插件
import simpleImportSort from 'eslint-plugin-simple-import-sort'
// 如果你还没有导入 eslint-plugin-react，需要导入
import reactPlugin from 'eslint-plugin-react'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            // prettier-config 必须放在最后以关闭冲突规则
            prettierConfig
        ],
        plugins: {
            prettier: prettierPlugin,
            // 注册 simple-import-sort 插件
            'simple-import-sort': simpleImportSort,
            // 注册 react 插件（为了 react/jsx-sort-props 规则）
            react: reactPlugin
        },
        rules: {
            // 让 Prettier 的格式问题作为 ESLint 错误显示，并自动修复（--fix 时）
            'prettier/prettier': 'error',
            // 关闭无用赋值检查，允许某些特定场景的赋值
            'no-useless-assignment': 'off',
            // 关闭 TypeScript 中的 any 类型检查
            '@typescript-eslint/no-explicit-any': 'off',

            // JSX 属性排序
            'react/jsx-sort-props': [
                'error',
                {
                    callbacksLast: true,
                    shorthandFirst: false,
                    ignoreCase: false,
                    noSortAlphabetically: false,
                    reservedFirst: true
                }
            ],

            // import 排序
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            'no-debugger':
                process.env.NODE_ENV === 'production' ? 'error' : 'off'
        },
        languageOptions: {
            globals: globals.browser
        }
    }
])
