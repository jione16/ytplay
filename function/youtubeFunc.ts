
import youtube from '../item/youtube'
import * as inquirer from 'inquirer'
import * as puppeteer from 'puppeteer'
import * as ora from 'ora'
import chalk from 'chalk'

let handleYouTubeFunc = async (browser: puppeteer.Browser) => {
    let page: puppeteer.Page = await browser.newPage()
    let isExit: boolean = false
    let spinner = ora("Loading unicorns").start("please wait..")
    await page.goto(youtube.URL)
    spinner.stop()
    console.log(`-${chalk.green('Type to search YouTube video')} \n-${chalk.yellow('Type "-m" to open menu')}`)
    while (true) {
        await inquirer.prompt({ type: 'input', name: 'reply', message: ">" })
            .then(async (answer) => {
                if (answer.reply == "-m") {
                    let option: string = await menu()
                    if (option == "Home") {
                        isExit = true
                    }

                } else {//search
                    await search(page, answer.reply)
                }
            })
            .catch(error => {
                console.log(error)
            })
        if (isExit) {
            browser.close()
            break
        }
    }
}

export default handleYouTubeFunc




const menu = async () => {
    let option: string
    await inquirer.prompt({ type: 'list', name: 'reply', message: ">", choices: ["Home", "Back"] })
        .then(answer => {
            option = answer.reply
        })
        .catch(error => {
            console.log(error)
        })
    return option
}


const search = async (page: puppeteer.Page, keyWord: string) => {
    await page.waitForSelector(youtube.searchSelector)
    await page.evaluate((obj) => {
        let element = <HTMLInputElement>document.querySelector(obj.searchSelector)
        let form = <HTMLFormElement>document.querySelector(obj.formSelector)
        element.value = obj.keyword
        //element.focus()
        form.submit()
    }, { keyword: keyWord, searchSelector: youtube.searchSelector,formSelector:youtube.formSelector })
    //await page.keyboard.press('Enter')
    //play random video
    await page.waitForNavigation()
    await page.waitForSelector(youtube.playSelector)
    await page.evaluate((selector) => {
        let element = <HTMLInputElement>document.querySelector(selector)
        element.click()
    }, youtube.playSelector)
}