const excel = require('exceljs')
const workbook = new excel.Workbook();

const createUserXls = (req, res) => {

    const users = workbook.addWorksheet('users');
    const A = 'A'
    const B = 'B'
    const C = 'C'
    const D = 'D'
    const E = 'E'
    const F = 'F'
    const G = 'G'
    const H = 'H'
    const I = 'I'
    const J = 'J'
    const K = 'K'

    let rowNo = 1
    users.getCell(A + rowNo).value = "userid"
    users.getCell(B + rowNo).value = "shopName"
    users.getCell(C + rowNo).value = "shopAddr"
    users.getCell(D + rowNo).value = "mobileNo"
    users.getCell(E + rowNo).value = "state"
    users.getCell(F + rowNo).value = "city"
    users.getCell(G + rowNo).value = "pincode"
    users.getCell(H + rowNo).value = "gstNo"
    users.getCell(I + rowNo).value = "email"
    users.getCell(J + rowNo).value = "fulllname"
    users.getCell(K + rowNo).value = "registrationDate"

    rowNo++;

    // col - sno, date, attendance_status

}