export default {
    extends: ['stylelint-config-standard-scss'], // 自动包含 postcss-scss 解析器
    root: true,
    overrides: [
        {
            files: ['**/*.less'],
            customSyntax: 'postcss-less',
        },
        // SCSS 文件处理
        {
            files: ['**/*.scss'],
            customSyntax: 'postcss-scss',
            extends: ['stylelint-config-standard-scss'], // 可选：继承 scss 规则
        },
    ],
    rules: {},
    ignoreFiles: [
        '**/*.min.css', // 忽略所有压缩文件
        'node_modules/**/*', // 忽略依赖目录
        'dist/**/*.css', // 忽略打包输出目录
    ],
}
