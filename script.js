
invoiceList.forEach(invoice => {
    let appender = document.querySelector(".invoice-container");
    let newInvoiceCard = ` <section>

      <section class="invoice-editor-container">
              <div class="status-bar-container">
                <p>${invoice.status}</p>
                <h4 class='status-indicator'>Pending</h4>
              </div>
              <div class="status-editing-btn-container">
                <button type="submit"  class="edit-btn" id="edit-btn">Edit</button>
                <button type="button" class="delete-btn" id="delete-btn">Delete</button>
                <button type="button" class="status-marker-btn" id="status-marker-btn">Mark as Paid</button>
              </div>
      </section>

      <!-- invoice info -->
      <section class="infos-container">
  
        <div class="sender-info">
          <span>
            <h1 class="invoice-id">${invoice.id}</h1> <br>
            <p class="invoice-description">${invoice.description}</p>
          </span>
          <span>
            <p class="sender-street-address-displayer">
             ${invoice.senderAddress.street}
            </p>
            <p class="sender-city-displayer">
             ${invoice.senderAddress.city}
            </p>
            <p class="sender-post-code">
              ${invoice.senderAddress.postCode}
            </p>
            <p class="sender-country">
              ${invoice.senderAddress.country}
            </p>
          </span>
        </div>
  
        <div class="client-info">
  
          <section class="invoice-date-container">
            <span>
              <p class="info-title">invoice date</p>
              <h2 class="invoice-created-date">${invoice.createdAt}</h2>
            </span>
            <span>
              <p class="info-title">payment due</p>
              <h2 class="invoice-due-date">31 sep 2021</h2>
            </span>
          </section>
  
          <section>
            <p class="info-title">bill to</p>
            <h2 class="client-name">${invoice.clientName}</h2>
            <p class="client-street-address-displayer">${invoice.clientAddress.street}</p>
            <p class="client-city-displayer">
              ${invoice.clientAddress.city}
            </p>
            <p class="client-postal-code-displayer">
              ${invoice.clientAddress.postCode}
            </p>
            <p class="client-country">
              ${invoice.clientAddress.country}
            </p>
          </section>
  
          <section>
            <p class="info-title">send to</p>
            <h2 class="client-email-displayer">
              ${invoice.clientEmail}
            </h2>
          </section>

        </div>
  
        <div class="item-info-container">
          <!-- item info -->
          <table class="item-container">
            <tr class="item-header">
              <th class="item-name-header section-name">item name</th>
              <th class="item-quantity-header section-quantity">QTY</th>
              <th class="item-price-header section-price">Price</th>
              <th class="item-total-header section-total">total</th>
            </tr>
  
            <tr>
              <td data-label="item" class="item-name-displayer section-name">banner design</td>
              <td class="item-quantity-displayer section-quantity">1</td>
              <td class="item-price-displayer section-price">$150</td>
              <td class="item-total-displayer section-total">$150</td>
            </tr>
          </table>
  
          <section class="amount-due-display-container">
            <p>amount due</p>
            <h2 class="amount-due">
              $150
            </h2>
          </section>

        </div>
  
      </section>
    </section>`;
    appender.innerHTML += newInvoiceCard;
})
function createInvoiceCard() {
    invoiceList.forEach(invoice => {
        let appender = document.querySelector(".invoice-");
        let newInvoiceCard = ` <section>

      <section class="invoice-editor-container">
              <div class="status-bar-container">
                <p>${invoice.status}</p>
                <h4 class='status-indicator'>Pending</h4>
              </div>
              <div class="status-editing-btn-container">
                <button type="submit"  class="edit-btn" id="edit-btn">Edit</button>
                <button type="button" class="delete-btn" id="delete-btn">Delete</button>
                <button type="button" class="status-marker-btn" id="status-marker-btn">Mark as Paid</button>
              </div>
      </section>

      <!-- invoice info -->
      <section class="infos-container">
  
        <div class="sender-info">
          <span>
            <h1 class="invoice-id">${invoice.id}</h1> <br>
            <p class="invoice-description">${invoice.description}</p>
          </span>
          <span>
            <p class="sender-street-address-displayer">
             ${invoice.senderAddress.street}
            </p>
            <p class="sender-city-displayer">
             ${invoice.senderAddress.city}
            </p>
            <p class="sender-post-code">
              ${invoice.senderAddress.postCode}
            </p>
            <p class="sender-country">
              ${invoice.senderAddress.country}
            </p>
          </span>
        </div>
  
        <div class="client-info">
  
          <section class="invoice-date-container">
            <span>
              <p class="info-title">invoice date</p>
              <h2 class="invoice-created-date">${invoice.createdAt}</h2>
            </span>
            <span>
              <p class="info-title">payment due</p>
              <h2 class="invoice-due-date">31 sep 2021</h2>
            </span>
          </section>
  
          <section>
            <p class="info-title">bill to</p>
            <h2 class="client-name">${invoice.clientName}</h2>
            <p class="client-street-address-displayer">${invoice.clientAddress.street}</p>
            <p class="client-city-displayer">
              ${invoice.clientAddress.city}
            </p>
            <p class="client-postal-code-displayer">
              ${invoice.clientAddress.postCode}
            </p>
            <p class="client-country">
              ${invoice.clientAddress.country}
            </p>
          </section>
  
          <section>
            <p class="info-title">send to</p>
            <h2 class="client-email-displayer">
              ${invoice.clientEmail}
            </h2>
          </section>

        </div>
  
        <div class="item-info-container">
          <!-- item info -->
          <table class="item-container">
            <tr class="item-header">
              <th class="item-name-header section-name">item name</th>
              <th class="item-quantity-header section-quantity">QTY</th>
              <th class="item-price-header section-price">Price</th>
              <th class="item-total-header section-total">total</th>
            </tr>
  
            <tr>
              <td data-label="item" class="item-name-displayer section-name">banner design</td>
              <td class="item-quantity-displayer section-quantity">1</td>
              <td class="item-price-displayer section-price">$150</td>
              <td class="item-total-displayer section-total">$150</td>
            </tr>
          </table>
  
          <section class="amount-due-display-container">
            <p>amount due</p>
            <h2 class="amount-due">
              $150
            </h2>
          </section>

        </div>
  
      </section>
    </section>`;
    })
  appender.innerHTML += newInvoiceCard;
}


// Update the invoice in the invoiceList array
const invoiceIndex = invoiceList.findIndex(item => item.id === invoice.id);
invoiceList[invoiceIndex] = invoice;