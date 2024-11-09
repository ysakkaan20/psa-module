const AD = require("./src/modules/activedirectory");

async function test(){

    try {
        // const resp = await AD.findOne('30998');
        const resp = await AD.findAll();
        console.log(resp)
    }catch (e) {
        console.error(e)
    }
}

test().then()
