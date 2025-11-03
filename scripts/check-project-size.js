#!/usr/bin/env node

// Verificar tamanho do projeto após limpeza
console.log('📊 VERIFICANDO TAMANHO DO PROJETO - AGENDMED\n');

const fs = require('fs');
const path = require('path');

function getDirectorySize(dirPath, excludeDirs = []) {
    let totalSize = 0;
    let fileCount = 0;
    
    try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            
            if (stats.isDirectory()) {
                if (!excludeDirs.includes(item)) {
                    const subResult = getDirectorySize(itemPath, excludeDirs);
                    totalSize += subResult.size;
                    fileCount += subResult.count;
                }
            } else {
                totalSize += stats.size;
                fileCount++;
            }
        }
    } catch (error) {
        // Ignorar erros de acesso
    }
    
    return { size: totalSize, count: fileCount };
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeProject() {
    console.log('🔍 Analisando estrutura do projeto...\n');
    
    // Diretórios para analisar
    const directories = [
        { name: 'src/', path: 'src' },
        { name: 'whatsapp-free/', path: 'whatsapp-free' },
        { name: 'scripts/', path: 'scripts' },
        { name: 'docs/', path: 'docs' },
        { name: 'prisma/', path: 'prisma' },
        { name: 'public/', path: 'public' }
    ];
    
    let totalProjectSize = 0;
    let totalProjectFiles = 0;
    
    console.log('📁 TAMANHO POR DIRETÓRIO:\n');
    
    directories.forEach(dir => {
        if (fs.existsSync(dir.path)) {
            const result = getDirectorySize(dir.path);
            totalProjectSize += result.size;
            totalProjectFiles += result.count;
            
            console.log(`   ${dir.name.padEnd(20)} ${formatBytes(result.size).padStart(10)} (${result.count} arquivos)`);
        } else {
            console.log(`   ${dir.name.padEnd(20)} ${'N/A'.padStart(10)} (não existe)`);
        }
    });
    
    // Verificar node_modules (se existir)
    if (fs.existsSync('node_modules')) {
        const nodeModulesResult = getDirectorySize('node_modules');
        console.log(`   ${'node_modules/'.padEnd(20)} ${formatBytes(nodeModulesResult.size).padStart(10)} (${nodeModulesResult.count} arquivos)`);
    }
    
    console.log('\n' + '─'.repeat(50));
    console.log(`   ${'TOTAL PROJETO'.padEnd(20)} ${formatBytes(totalProjectSize).padStart(10)} (${totalProjectFiles} arquivos)`);
    
    // Arquivos de configuração na raiz
    console.log('\n📄 ARQUIVOS DE CONFIGURAÇÃO:\n');
    
    const configFiles = [
        'package.json', '.env', '.gitignore', 'README.md',
        'next.config.js', 'tailwind.config.ts', 'tsconfig.json'
    ];
    
    configFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            console.log(`   ${file.padEnd(20)} ${formatBytes(stats.size).padStart(10)}`);
        }
    });
    
    // Estatísticas de limpeza
    console.log('\n🧹 RESULTADO DA LIMPEZA:\n');
    
    const essentialFiles = [
        'src/app/(panel)/dashboard/whatsapp/page.tsx',
        'src/app/api/whatsapp/connect/route.ts',
        'src/app/api/whatsapp/status/route.ts',
        'whatsapp-free/headless-bot.js',
        'whatsapp-free/qr-only-bot.js',
        'scripts/create-test-doctor.js',
        'scripts/seed-test-data.js'
    ];
    
    let essentialCount = 0;
    essentialFiles.forEach(file => {
        if (fs.existsSync(file)) {
            essentialCount++;
        }
    });
    
    console.log(`   ✅ Arquivos essenciais mantidos: ${essentialCount}/${essentialFiles.length}`);
    console.log(`   📁 Total de arquivos no projeto: ${totalProjectFiles}`);
    console.log(`   📦 Tamanho total (sem node_modules): ${formatBytes(totalProjectSize)}`);
    
    // Verificar se ferramentas de dev foram movidas
    const devToolsExists = fs.existsSync('scripts/dev-tools');
    const docsExists = fs.existsSync('docs');
    
    console.log(`   🔧 Ferramentas de dev organizadas: ${devToolsExists ? '✅' : '❌'}`);
    console.log(`   📚 Documentação organizada: ${docsExists ? '✅' : '❌'}`);
    
    // Performance estimada
    console.log('\n⚡ ESTIMATIVA DE PERFORMANCE:\n');
    
    if (totalProjectSize < 5 * 1024 * 1024) { // 5MB
        console.log('   🚀 Build: Muito rápido');
        console.log('   📦 Deploy: Otimizado');
        console.log('   🔍 Navegação: Excelente');
    } else if (totalProjectSize < 10 * 1024 * 1024) { // 10MB
        console.log('   ⚡ Build: Rápido');
        console.log('   📦 Deploy: Bom');
        console.log('   🔍 Navegação: Boa');
    } else {
        console.log('   ⏳ Build: Moderado');
        console.log('   📦 Deploy: Pode ser otimizado');
        console.log('   🔍 Navegação: Considere mais limpeza');
    }
}

analyzeProject();