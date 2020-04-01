'use strict'

import { Codenation } from "../models/Codenation"

const path = require('path')
const fs = require('fs')
const axios = require('axios')
const api = require('../service/api')
const FormData = require('form-data')
const { Helpers } = require('../helpers/index')
const jsonFile = path.resolve(__dirname, '..', '..', 'storage', 'answer.json')

export class App {
  challenge !: Codenation
  endpoint: string
  /* Steps properties */
  temp: any
  getChallengeResult !: Codenation
  writeFileResult: boolean = false
  decryptMessageResult !: string
  generateCryptoResumeResult !: string
  updateFileResult !: Codenation
  postChallengeResult !: object
  timeout: number = 3000

  constructor(private codenation: Codenation) {
    this.endpoint = `${api.base_url}/generate-data?token=${api.token}`
    this.start()
  }

  async getChallenge (): Promise<Codenation>  {
    try {
      const { data } = await axios.get(this.endpoint)

      return data
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async postChallenge (): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('answer', fs.createReadStream(jsonFile))

      const headers = formData.getHeaders()

      return await axios
        .post(`${api.base_url}/submit-solution?token=${api.token}`,
          formData,
          { headers }
        )
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async writeFile (fileContent: Codenation): Promise<boolean> {
    try {
      // Antes de gravar no arquivo, apaga seu conteúdo
      await fs.truncate(jsonFile, 0, (err: any) => {
        if (err) throw new Error()
      })

      // Grava o conteúdo no arquivo
      await fs.appendFile(jsonFile, JSON.stringify(fileContent, null, 2),
        (err: any) => {
          if (err) throw new Error()
        }
      )

      return true
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async updateFile (content: Codenation, decryptMessageResult: string, generateCryptoResumeResult: string): Promise<Codenation> {
    try {
      const finalSolution = content
      finalSolution.decifrado = decryptMessageResult
      finalSolution.resumo_criptografico = generateCryptoResumeResult

      await this.writeFile(finalSolution)

      return finalSolution
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async step1(): Promise<boolean> {
    try {
      Helpers.msgLog('promise', `Solicitando desafio à Codenation (${this.endpoint})...`, 1)

      this.temp = await this.getChallenge()
      this.getChallengeResult = await this.temp

      if (this.getChallengeResult) Helpers.msgLog('success', `desafio obtido com sucesso:\n ${JSON.stringify(this.getChallengeResult, null, 2)}`)

      return Promise.resolve(true)
    } catch (err) {
      throw new Error(Helpers.msgLog('error', `Erro na execução da Etapa 1: ${err.message}\n`))
    }
  }

  async step2(): Promise<boolean> {
    try {
      Helpers.msgLog('promise', `Criando o arquivo do desafio...`, 2)

      this.temp = await this.writeFile(this.getChallengeResult)
      this.writeFileResult = await this.temp

      if (this.writeFileResult) Helpers.msgLog('success', 'desafio salvo com sucesso no arquivo JSON')

      return Promise.resolve(true)
    } catch (err) {
      throw new Error(Helpers.msgLog('error', `Erro na execução da Etapa 2: ${err.message}\n`))
    }
  }

  async step3(): Promise<boolean> {
    try {
      Helpers.msgLog('promise', `Descriptografando a mensagem...`, 3)

      this.temp = await Helpers.decryptMessage(this.getChallengeResult.cifrado, this.getChallengeResult.numero_casas)
      this.decryptMessageResult = await this.temp

      if (this.decryptMessageResult) Helpers.msgLog('success', `mensagem descriptografada com sucesso:\n ${this.decryptMessageResult}`)

      return Promise.resolve(true)
    } catch (err) {
      throw new Error(Helpers.msgLog('error', `Erro na execução da Etapa 3: ${err.message}\n`))
    }
  }

  async step4(): Promise<boolean> {
    try {
      Helpers.msgLog('promise', `Gerando o resumo criptográfico...`, 4)

      this.temp = await Helpers.generateCryptoResume(this.decryptMessageResult)
      this.generateCryptoResumeResult = await this.temp

      if (this.generateCryptoResumeResult) Helpers.msgLog('success', `resumo criptográfico gerado com sucesso:\n ${this.generateCryptoResumeResult}`)

      return Promise.resolve(true)
    } catch (err) {
      throw new Error(Helpers.msgLog('error', `Erro na execução da Etapa 4: ${err.message}\n`))
    }
  }

  async step5(): Promise<boolean> {
    try {
      Helpers.msgLog('promise', `Atualizando arquivo com a solução...`, 5)

      this.temp = await this.updateFile(this.getChallengeResult, this.decryptMessageResult, this.generateCryptoResumeResult)
      this.updateFileResult = await this.temp

      if (this.updateFileResult) Helpers.msgLog('success', `arquivo atualizado com sucesso: ${JSON.stringify(this.updateFileResult, null, 2)}\n`)

      return Promise.resolve(true)
    } catch (err) {
      throw new Error(Helpers.msgLog('error', `Erro na execução da Etapa 5: ${err.message}\n`))
    }
  }

  async step6(): Promise<boolean> {
    try {
      Helpers.msgLog('promise', 'enviando solução à Codenation...\n', 6)

      this.temp = await this.postChallenge()
      this.postChallengeResult = await this.temp

      if (this.postChallengeResult) Helpers.msgLog('success', `resposta do envio à Codenation: ${this.postChallengeResult}\n`)

      return Promise.resolve(true)
    } catch (err) {
      throw new Error(Helpers.msgLog('error', `Erro na execução da Etapa 6: ${err.message}\n`))
    }
  }

  async start(): Promise<any> {
    try {
      this.step1().then(() => {
        this.step2().then(() => {
          this.step3().then(() => {
            this.step4().then(() => {
              this.step5().then(() => {
                this.step6().then(() => Helpers.msgLog('end', 'Processamento finalizado.', 9))
              })
            })
          })
        })
      })
    } catch (err) {
      throw new Error(Helpers.msgLog('error', `não foi possível solucionar o desafio, verifique os erros no log: ${err.message}`, 9))
    }
  }

}
