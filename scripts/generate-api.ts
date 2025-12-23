#!/usr/bin/env node

import { execSync } from 'child_process'
import { config } from 'dotenv'
import { resolve } from 'path'
import { existsSync } from 'fs'

config()

const OPENAPI_SPEC_URL = process.env.OPENAPI_SPEC_URL

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function main() {
  log('🔍 檢查環境變數...', 'blue')

  // 檢查是否在 CI/CD 環境（Vercel 會設定這些環境變數）
  const isCI = process.env.CI === 'true' || process.env.VERCEL === '1'

  if (!isCI) {
    const envPath = resolve(process.cwd(), '.env')
    if (!existsSync(envPath)) {
      log('❌ 錯誤：找不到 .env 檔案', 'red')
      log('請先複製 .env.example 並設置環境變數：', 'yellow')
      log('  cp .env.example .env', 'yellow')
      process.exit(1)
    }
  } else {
    log('ℹ️  偵測到 CI/CD 環境，跳過 .env 檔案檢查', 'blue')
  }

  if (!OPENAPI_SPEC_URL) {
    log('❌ 錯誤：未設置 OPENAPI_SPEC_URL 環境變數', 'red')
    if (isCI) {
      log('請在 Vercel 專案設定中添加環境變數：OPENAPI_SPEC_URL', 'yellow')
    } else {
      log('請在 .env 檔案中設置：', 'yellow')
      log('  OPENAPI_SPEC_URL=https://your-api-url/swagger/doc.json', 'yellow')
    }
    process.exit(1)
  }

  log(`✅ 找到 API 規範 URL: ${OPENAPI_SPEC_URL}`, 'green')
  log('', 'reset')
  log('🔄 開始生成 API 客戶端...', 'blue')

  try {
    const command = `npx openapi-generator-cli generate -i ${OPENAPI_SPEC_URL} -g typescript-axios -o ./types/api`

    log(`執行命令: ${command}`, 'blue')
    log('', 'reset')

    execSync(command, {
      stdio: 'inherit',
      env: { ...process.env },
    })

    log('', 'reset')
    log('✅ API 客戶端生成成功！', 'green')
    log('📁 生成的檔案位於: ./types/api/', 'green')
  } catch (error) {
    log('', 'reset')
    log('❌ API 客戶端生成失敗', 'red')
    if (error instanceof Error) {
      log(`錯誤訊息: ${error.message}`, 'red')
    }
    process.exit(1)
  }
}

main()
