const fetch = require('node-fetch');

const getCustomerDataUrl = 'https://s3.amazonaws.com/misc-file-snack/MOCK_SNACKER_DATA.json';
const getStockDataUrl = 'https://ca.desknibbles.com/products.json?limit=250'

async function getData(url){
    const response = await fetch(url);//Should add some error handling check if 200
    return response.json();
}

async function filterCustomerData(original, comparison){
    return original.filter(customerData => {//Filter
        for (i in comparison['products']){
            if(customerData.fave_snack == comparison['products'][i]['title']){
                return true
            }
        }
        return false;
    })
}

async function filterStockData(original, comparison){
    return original.filter(element => {
        for (i in comparison){
            if(element.title == comparison[i]['fave_snack']){
                return true;
            }
        }
        return false;
    })
}

async function questionA(data){
    console.log("Question 1A - List the real stocked snacks you found under the snacker's 'fave_snack'?");
    for (i in data){
        console.log(data[i]['title'])
    }
}

async function questionB(data){
    console.log("");
    console.log("Question 1B - What're the emails of the snackers who listed those as a 'fave_snack'?")
    for (i in data){
        console.log(data[i]["email"]);
    }
}

async function questionC(customerData, snackData){
    console.log("");
    console.log("Question 1C - If all those snackers we're to pay for their 'fave_snack'what's the total price?")
    let totalCount = 0.0;
    for (i in customerData){
        for (j in snackData){
            if (customerData[i]["fave_snack"] == snackData[j]["title"]){
                totalCount += parseFloat(snackData[j]["variants"][0]["price"]);
            }
        }
    }
    console.log("Total amount is: $" + totalCount);
}


async function main(){
    let customerData = await getData(getCustomerDataUrl);
    let stockData = await getData(getStockDataUrl);
    
    let filteredCustomerData = await filterCustomerData(customerData,stockData)
    let filteredStockData = await filterStockData(stockData["products"], filteredCustomerData);

    await questionA(filteredStockData);
    await questionB(filteredCustomerData);
    await questionC(filteredCustomerData, filteredStockData);
}

main();