function get_principal(EMI, R, N) {

    /*
    EMI = monthly payment
    R = monthly interest rate
    N = months

    EMI = [P x R x (1+R)^N]/[(1+R)^N - 1]
    P = principal
    R = Interest rate per month
    N = number of EMI installments (duration)

    source: https://razorpay.com/docs/payments/payment-gateway/affordability/no-cost-emi/
    */
    var R1 = 1 + R;
    return ((EMI * ((R1 ** N) - 1) / (R * (R1 ** N))));
}

function emi_saving_calculate() {
    var AMOUNT = Number(document.getElementById("Amount").value);
    var months = Number(document.getElementById("EMI_MONTHS").value);
    var EMI_INTEREST = Number(document.getElementById("EMI_INTEREST").value) / 100;
    var SAVING_INTEREST = Number(document.getElementById("SAVING_INTEREST").value) / 100;
    var IGST = Number(document.getElementById("IGST").value) / 100;
    var SAVING_AMOUNT = AMOUNT;
    var month_mul = 1 / 12;
    var EMI = Math.ceil(AMOUNT / months);

    var R = month_mul * EMI_INTEREST;
    var principal = get_principal(EMI, R, months);
    // console.log("principal", principal, EMI, R, months);
    var discount = AMOUNT - principal;
    var total_payment = 0;
    var saving_balance = SAVING_AMOUNT;
    var data = [];
    for (let index = 0; index < months; index++) {
        var old_principal = principal;
        var new_principal = principal + (R * principal) - EMI;
        var current_IGST = R * principal * IGST;
        // console.log(principal, R, EMI, new_principal, current_IGST);
        var current_payment = EMI + current_IGST;
        total_payment += current_payment;
        principal = new_principal;
        saving_balance += (
            saving_balance * month_mul * SAVING_INTEREST
        ) - current_payment;
        data.push({
            "Month": index + 1,
            "Outstanding loan at the start of the month": old_principal,
            "Outstanding loan at the end of the month": principal,
            "EMI": EMI,
            "IGST": current_IGST,
            "Current Payment (EMI + IGST)": current_payment,
            "Saving Account Balance Before Payment": saving_balance,
            "Saving Account Balance After Payment (includes saving interest)": saving_balance,
        })
    }

    var extra_payment = total_payment - AMOUNT;
    var saving_data = [{ "Discount on EMI:": discount }, { "Total Payment(including IGST):": total_payment }, { "Extra Payment:": extra_payment }, { "Saving Balance(after all payments):": saving_balance }]
    var saving_data_html = '';
    saving_data.forEach(element => {
        for (const [key, value] of Object.entries(element)) {
            saving_data_html += "<li>" + key + " " + Math.round(value) + "</li>"
        }

    });
    document.getElementById("saving_text").innerHTML = saving_data_html;

    var tableRef = document.getElementById("calculation-table");
    var table_html = '<thead>';
    for (key in data[0]) {
        table_html += '<th>' + key + '</th>';
    }
    table_html += "</tr></thead><tbody>";
    for (var i = 0; i < data.length; i++) {
        table_html += '<tr>';
        for (key in data[i]) {
            table_html += '<td>' + Math.round(data[i][key]) + '</td>';
        }
        table_html += '</tr>';
    }
    table_html += "</tbody>"
    tableRef.innerHTML = table_html;

}