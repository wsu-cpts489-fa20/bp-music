import {Selector, ClientFunction} from 'testcafe'  
import {ReactSelector, waitForReact} from 'testcafe-react-selectors'

const search = ReactSelector('App Search')

fixture `Artist Account Interactions`.page `localhost:8081`.beforeEach(async()=>{await waitForReact()})

// test('Create Artist Account & Login', async t => {

//     const select = Selector('#genres');
//     const genereSelect = select.find("option").withExactText("Hip-Hop");
//     const setSelected = ClientFunction(option => {option().selected = true;});

//     const accountTypeInput = Selector('#accountTypeBtn');
//     const accountTypeOption = accountTypeInput.find('option');
//     const emailInput = Selector('#accountName');
//     const passwordInput = Selector('#passwordInput');
//     const repeatPasswordInput = Selector('#repeatPasswordInput');
//     const securityQInput = Selector('#securityQInput');
//     const securityAInput = Selector('#securityAInput');
    
//     const artistNameInput = Selector('#artistNameInput');
//     const genreInput = Selector('#genres');
//     const genreOption = genreInput.find('option');
//     const instagramHandleInput = Selector('#instagramHandleInput');
//     const facebookHandleInput = Selector('#facebookHandleInput');

//     const userEmail = Selector('#userEmail');
//     const userPass = Selector('#userPassword');

//     await t
//         .click('#createAccountBtn')
//         .wait(1000)
//         .expect(Selector('#createNewAccountDialog').visible).eql(true)
//         .click(accountTypeInput)
//         .click('#artist')
//         .typeText(emailInput, "artist@wsu.edu")
//         .typeText(passwordInput, 'Artistaccount1')
//         .typeText(repeatPasswordInput, 'Artistaccount1')
//         .typeText(securityQInput, 'Question')
//         .typeText(securityAInput, 'Answer')
//         await t.click('#submitAccountBtn')
//             .expect(Selector('#renderArtistDialog').visible).eql(true)
//             .typeText(artistNameInput, 'Kid Cudi')
//             .click('#checkbox')
//             .typeText(instagramHandleInput, 'kidcudi')
//             .typeText(facebookHandleInput, 'kidcudi')
//             .click('#submitArtistAccountBtn')
//             .expect(Selector('#renderArtistDialog').visible).eql(false)
//             await t.click(userEmail)
//                 .typeText(userEmail, email)
//                 .typeText(userPass, password)
//                 .click('#loginBtn')
//                 .wait(3000)
//                 .expect(Selector('#loginPage').visible).eql(false)
// })

// test('Login Artist Account', async t => {

//     const userEmail = Selector('#userEmail');
//     const userPass = Selector('#userPassword');

//     await t
//         .typeText(userEmail, "ded@wsu.edu")
//         .typeText(userPass, "Little09100")
//         .click('#loginBtn')
//         .wait(3000)
//         .expect(Selector('#loginPage').visible).eql(false)
// })

test('Login & Edit Artist Account', async t => {

    const userEmail = Selector('#userEmail');
    const userPass = Selector('#userPassword');

    await t
        .typeText('#userEmail', "ded@wsu.edu")
        .typeText('#userPassword', "Little09100")
        .click('#loginBtn')
        .wait(3000)
        .expect(Selector('#loginPage').visible).eql(false)

        .click('#sidemenuBtn')
        .click('#accountBtn')
        .typeText('#passwordInput', "Little091000")
        .typeText('#passwordRepeatInput', "Little091000")
        .click('#submitAccountBtn')
})