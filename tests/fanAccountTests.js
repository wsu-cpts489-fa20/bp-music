import {Selector, ClientFunction} from 'testcafe'  
import {ReactSelector, waitForReact} from 'testcafe-react-selectors'

const search = ReactSelector('App Search')

fixture `Fan Account Creation`.page `localhost:8081`.beforeEach(async()=>{await waitForReact()})

test('Test Create Fan Account', async t => {
    const email = 'ImmaFan@live.com';
    const password = 'ImmaFan1';
    const securityQ = 'Ooop';
    const securityA = 'Dooop';

    const emailInput = Selector('#emailInput');
    const userEmail = Selector('#userEmail');
    const userPass = Selector('#userPassword');
    const passwordInput = Selector('#passwordInput');
    const repeatPasswordInput = Selector('#repeatPasswordInput');
    const securityQInput = Selector('#securityQInput');
    const securityAInput = Selector('#securityAInput');

    await t.click('#createAccountBtn')
        .wait(1000)
        .expect(Selector('#createNewAccountDialog').visible).eql(true)
        .typeText(emailInput, email)
        .typeText(passwordInput, password)
        .typeText(repeatPasswordInput, password)
        .typeText(securityQInput, securityQ)
        .typeText(securityAInput, securityA)
        await t.click('#submitAccountBtn')
            .expect(Selector('#renderFanDialog').visible).eql(true)
            .click('#checkbox')
            .click('#fanAccountBtn')
            .expect(Selector('#renderFanDialog').visible).eql(false)
            await t.click(userEmail)
                .typeText(userEmail, email)
                .typeText(userPass, password)
                .click('#loginBtn')
                .wait(3000)
                .expect(Selector('#loginPage').visible).eql(false)
                await t.expect(Selector('#feedPage').visible).eql(true)
                    .click('#menuBtnIcon')
                    .wait(1000)
                    .click('#accountBtn')
                    .wait(1000)
                    .typeText(emailInput, email)
                    .typeText(passwordInput, password)
                    .typeText(repeatPasswordInput, password)
                    .typeText(securityQInput, securityQ)
                    .typeText(securityAInput, securityA)
                    await t.click('#submitAccountBtn')
                        .expect(Selector('#renderFanDialog').visible).eql(true)
                        .click('#checkbox')
                        .click('#fanAccountBtn')
                        .expect(Selector('#renderFanDialog').visible).eql(false)
    // await t.typeText(userEmail, email)
    //     .wait(1000)
    //     .typeText(userPass, password)
    //     .wait(1000)
    //     .click('#loginBtn')
    //     .wait(1000)
    //     await t.expect(Selector('#feedPage').visible).eql(true)
    //         .click('#menuBtnIcon')
    //         .wait(1000)
            // .click('#accountBtn')
            // .wait(1000)
            // .typeText(emailInput, email)
            // .typeText(passwordInput, password)
            // .typeText(repeatPasswordInput, password)
            // .typeText(securityQInput, securityQ)
            // .typeText(securityAInput, securityA)
            // await t.click('#submitAccountBtn')
            //     .expect(Selector('#renderFanDialog').visible).eql(true)
            //     .click('#checkbox')
            //     .click('#fanAccountBtn')
            //     .expect(Selector('#renderFanDialog').visible).eql(false)
})