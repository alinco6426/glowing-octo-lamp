
const invoiceAppender = [] ;
localStorage.setItem('invoiceAppender',invoiceAppender);

async function fetchData() {
    const response = await fetch('data.json');
    const data = await response.json();
    invoiceAppender.push(data);
    localStorage.setItem("invoiceAppender", JSON.stringify(invoiceAppender))
    console.log(invoiceAppender);
    return data;
}

async function processFetchedData() {
    await fetchData();
    invoiceAppender.forEach(item => {
        console.log(item.clientName);
    });
}

processFetchedData();
async function fetchData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        // fetching invoices from the locally created json and adding it to the invoicelis
        let feetchedInvoice = data;
        feetchedInvoice.forEach(invoice => {
            if (invoiceList.includes(invoice.id)) {
                return false
            } else {
                invoiceList.push(invoice)
                return true;
            }
        })

    }
    catch (error) {
        console.log(`Error: ${error}`)
    }
}
fetchData();
