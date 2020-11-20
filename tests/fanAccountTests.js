import {Selector, ClientFunction} from 'testcafe'  
import {ReactSelector, waitForReact} from 'testcafe-react-selectors'

const search = ReactSelector('App Search')

fixture `Fan Account Creation`.page `localhost:8081`.beforeEach(async()=>{await waitForReact()})

test('Test Create Fan Account', async t => {
    const email = 'Fanacct@live.com';
    const password = 'Fanaccount1';
    const securityQ = 'Question';
    const securityA = 'Answer';

    const emailInput = Selector('#emailInput');
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
            // .wait(1000)
            // .click('#checkbox-Jay-Z')
            // .wait(1000)
            // .click('#checkbox-Hollywood Bowl')
            // .wait(1000)
            // .click('#checkbox-The Showbox')
})

// test('test business search', async t =>{

//     const locationSearch = search.findReact('LocationSearch')
    
//     await t
//     .click(locationSearch)
//     .expect(locationSearch.find('.locationMenu').visible).eql(true)
//     .click(locationSearch.find('select'))
// })

// test('test business search 2', async t =>{

//     const locationSearch = search.findReact('LocationSearch')
    
//     await t
//     .click(locationSearch)
//     .expect(locationSearch.find('.locationMenu').visible).eql(true)
//     .click(locationSearch.find('select'))
//     .click(locationSearch.find('option').filter('[value="AZ"]'))
//     .expect(locationSearch.find('select').selectedIndex).eql(2)
// })