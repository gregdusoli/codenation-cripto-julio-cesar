'use strict'

const emoji = require('node-emoji')

export class Helpers {

  public static msgLog(type: string, msg: string, step: number = 0): void {
    const printStep = (stepNum: number) => {
      let hasStep: string = `\n Etapa ${stepNum}:`

      if (stepNum === 9) hasStep = ''

      const divStep: string = `------------------------------------------------${hasStep}`

      console.log(divStep)
    }

    switch (type) {
      case "success":
        if (step) printStep(step);
        console.info(`\n ${emoji.emojify(":white_check_mark:")} ${msg} \n`)

        break;
      case "error":
        if (step) printStep(step);
        console.error(`\n ${emoji.emojify(":warning:")}  ${msg} \n`)

        break;
      case "promise":
        if (step) printStep(step);
        console.info(`\n ${emoji.emojify(":aquarius:")} ${msg} \n`)

        break;
      case "end":
        if (step) printStep(step);
        console.info(`\n ${emoji.emojify(":black_square_for_stop:")}  ${msg} \n`)

        break
      default:
        if (step) printStep(step);
        console.info(`\n ${emoji.emojify(":o2:")}  ${msg} \n`)

        break
    }
  }

  public static decryptMessage (encryptedMessage: string, codenationNumCasas: number): string {
    const alfabeto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    // Garantido que todo texto esteja em minúsculo
    const textoCifrado = encryptedMessage.toLowerCase()

    // Divindo as palavras do texto cifrado e colocando cada uma em um array
    const textoCifradoArray = textoCifrado.split(' ')

    // Criando o loop de descriptografia para cada palavra no texto criptografado
    let textoDescriptografado = ''

    textoCifradoArray.map((palavra) => {
      // Transformando a string em array para ser possível manipular as letras
      const palavraCifradaArray = []

      for (let i = 0; i < palavra.length; i++) {
        palavraCifradaArray.push(palavra.charAt(i))
      }

      let palavraCifrada = ''

      palavraCifradaArray.forEach((letra) => {
        palavraCifrada += letra
      })

      // Obtendo a posição original no array alfabeto para cada letra na palavra cifrada
      let palavraCifradaPosicoes = ''

      palavraCifradaArray.forEach((letra) => {
        palavraCifradaPosicoes += alfabeto.indexOf(letra) !== -1 ? `${alfabeto.indexOf(letra)},` : `(${letra})`
      })

      // Calculando a posição da letra cifrada em relação à posição da letra
      // original no alfabeto
      const palavraDecifradaPosicoes = []

      for (let i = 0, pointer; i < palavraCifrada.length; i++) {
        pointer = ''
        let letra = ''
        let posicaoLetraNoAlfabeto = 0

        letra = palavraCifrada.charAt(i)

        if (alfabeto.includes(letra)) {
          posicaoLetraNoAlfabeto = alfabeto.indexOf(letra)

          if (posicaoLetraNoAlfabeto - codenationNumCasas < 0) {
            pointer = alfabeto.length
              - codenationNumCasas
              + posicaoLetraNoAlfabeto
          } else {
            pointer = posicaoLetraNoAlfabeto - codenationNumCasas
          }

          palavraDecifradaPosicoes.push(pointer)
        } else {
          palavraDecifradaPosicoes.push(letra)
        }
      }

      // Decifrando a palavra através das posições das letras no alfabeto
      let palavraDecifrada = ''

      palavraDecifradaPosicoes.map((letra) => {
        if (typeof letra === 'number') {
          palavraDecifrada += alfabeto[letra]
        } else {
          palavraDecifrada += letra
        }
      })

      textoDescriptografado += `${palavraDecifrada} `
    })

    return textoDescriptografado.trim()
  }

  // tslint:disable: no-bitwise
  // tslint:disable: no-shadowed-variable
  public static generateCryptoResume (str: string): string {
    /*
      Este método foi criado por terceiros os créditos estão na documentação a seguir.
      Contudo, fiz algumas adequações para os patters Typescript, não adulterando a lógica original.

      discuss at: http://phpjs.org/functions/sha1/
      original by: Webtoolkit.info (http://www.webtoolkit.info/)
      improved by: Michael White (http://getsprink.com)
      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      input by: Brett Zamir (http://brett-zamir.me)
      depends on: utf8_encode
      example 1: sha1('Kevin van Zonneveld');
      returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'
     */

    try {
      const rotateLeft: any = (n: any, s: any) => {

        const t4: any = (n << s) | (n >>> (32 - s))
        return t4
      }

      /* var lsb_hex = function (val) { // Not in use; needed?
        var str="";
        var i;
        var vh;
        var vl;

        for ( i=0; i<=6; i+=2 ) {
          vh = (val>>>(i*4+4))&0x0f;
          vl = (val>>>(i*4))&0x0f;
          str += vh.toString(16) + vl.toString(16);
        }
        return str;
      }; */

      const cvtHex: any = (val: any) => {
        let str: any = ''
        let i: any
        let v: any

        for (i = 7; i >= 0; i--) {
          v = (val >>> (i * 4)) & 0x0f
          str += v.toString(16)
        }
        return str
      }

      let blockstart: any
      let i: any
      let j: any
      const W = new Array(80)
      let H0 = 0x67452301
      let H1 = 0xefcdab89
      let H2 = 0x98badcfe
      let H3 = 0x10325476
      let H4 = 0xc3d2e1f0
      let A: any
      let B: any
      let C: any
      let D: any
      let E: any
      let temp: any

      const strLen: number = str.length

      const wordArray: any[] = []
      for (i = 0; i < strLen - 3; i += 4) {
        j =
            (str.charCodeAt(i) << 24) |
            (str.charCodeAt(i + 1) << 16) |
            (str.charCodeAt(i + 2) << 8) |
            str.charCodeAt(i + 3)
        wordArray.push(j)
      }

      switch (strLen % 4) {
        case 0:
          i = 0x080000000
          break
        case 1:
          i = (str.charCodeAt(strLen - 1) << 24) | 0x0800000
          break
        case 2:
          i =
              (str.charCodeAt(strLen - 2) << 24) |
              (str.charCodeAt(strLen - 1) << 16) |
              0x08000
          break
        case 3:
          i =
              (str.charCodeAt(strLen - 3) << 24) |
              (str.charCodeAt(strLen - 2) << 16) |
              (str.charCodeAt(strLen - 1) << 8) |
              0x80
          break
      }

      wordArray.push(i)

      while (wordArray.length % 16 !== 14) {
        wordArray.push(0)
      }

      wordArray.push(strLen >>> 29)
      wordArray.push((strLen << 3) & 0x0ffffffff)

      for (blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
        for (i = 0; i < 16; i++) {
          W[i] = wordArray[blockstart + i]
        }
        for (i = 16; i <= 79; i++) {
          W[i] = rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
        }

        A = H0
        B = H1
        C = H2
        D = H3
        E = H4

        for (i = 0; i <= 19; i++) {
          temp =
              (rotateLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) &
              0x0ffffffff
          E = D
          D = C
          C = rotateLeft(B, 30)
          B = A
          A = temp
        }

        for (i = 20; i <= 39; i++) {
          temp =
              (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) &
              0x0ffffffff
          E = D
          D = C
          C = rotateLeft(B, 30)
          B = A
          A = temp
        }

        for (i = 40; i <= 59; i++) {
          temp =
              (rotateLeft(A, 5) +
                ((B & C) | (B & D) | (C & D)) +
                E +
                W[i] +
                0x8f1bbcdc) &
              0x0ffffffff
          E = D
          D = C
          C = rotateLeft(B, 30)
          B = A
          A = temp
        }

        for (i = 60; i <= 79; i++) {
          temp =
              (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) &
              0x0ffffffff
          E = D
          D = C
          C = rotateLeft(B, 30)
          B = A
          A = temp
        }

        H0 = (H0 + A) & 0x0ffffffff
        H1 = (H1 + B) & 0x0ffffffff
        H2 = (H2 + C) & 0x0ffffffff
        H3 = (H3 + D) & 0x0ffffffff
        H4 = (H4 + E) & 0x0ffffffff
      }

      temp = cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4)
      temp = temp.toString().toLowerCase()

      return temp
    } catch (err) {
      throw new Error(`f(generateCryptoResume) não foi possível gerar o resumo criptográfico SHA1: ${err.message}\n`)
    }
  }

}
