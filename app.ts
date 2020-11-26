import * as puppeteer from 'puppeteer'
import * as inquirer from 'inquirer'
import handleYoutubeFunc from './function/youtubeFunc'

let browser: puppeteer.Browser
//set listener to 0 
process.setMaxListeners(0)

const start = async () => {
    let isExit: boolean = false
    while (true) {
        await inquirer
            .prompt({
                type: 'list',
                name: 'option',
                choices: ["Open YouTube", "Exit"]

            })
            .then(async (answers) => {
                if (answers.option == "Exit") {
                    isExit = true
                    return
                } else {
                    browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: [`--window-size=50,50`,'--autoplay-policy=no-user-gesture-required'],ignoreDefaultArgs:['--mute-audio'] })
                    await handleYoutubeFunc(browser)
                }
            })
            .catch(error => {
                console.log(error)
            })

        if (isExit) {
            browser.close()
            break
        } else {
            continue
        }
    }


}


start()
