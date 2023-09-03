/***********************************************************************
Program: ROYAL alpha 601sc cash management system emulator 
Author: Nathaniel Beaver
Date: February 10, 2011
Begun in September 2010 and worked on sporadically since then, this 
cash register emulator is my first web application. Those familiar 
with Javascript will note the total lack of object-oriented design 
and egregious use of global variables, which is a by-product of my 
familiarity with C. This was largely written using Geany and Firebug 
on Ubuntu 10.04 (Lucid Lynx).
Useful Websites:
http://www.communitymx.com/content/article.cfm?cid=529b0
http://www.elated.com/articles/working-with-dates/
http://www.elated.com/articles/html5-audio/
***********************************************************************/
var EmployeeName = new Array();
EmployeeName[1]="MXXX DXXXXXXXXX";
EmployeeName[2]="MXXXXX BXXXXXX";
EmployeeName[3]="NXXXXXXXX BXXXXX";
EmployeeName[4]="PXXXX DXXXXXXX";
EmployeeName[5]="AXXX EXXXX";
EmployeeName[6]="BXXXXXX FXXXX";
EmployeeName[7]="CXXX GXXXXX";
EmployeeName[8]="JXXXX HXXX";
EmployeeName[9]="EXXX HXXXXXXXX";
EmployeeName[10]="AXXXXX HXXXXXXXX";
EmployeeName[11]="JXXXXX HXXXXXXXXXX";
EmployeeName[12]="GXXXXXX HXXXXXX";
EmployeeName[13]="MXXXX HXXXXXXX";
EmployeeName[14]="MXXXXXX HXXXXXXX";
EmployeeName[15]="AXXXXX HXXXXX";
EmployeeName[16]="DXXX JXXXXX";
EmployeeName[17]="EXXX LXXXXX";
EmployeeName[18]="MXXXXXXX RXXXXXX";
EmployeeName[19]="TXXXX RXXX";
EmployeeName[20]="KXXX RXXXX";
EmployeeName[21]="JXXX SXXXXXX";
EmployeeName[22]="HXXXXXX TXXXXXX";
EmployeeName[23]="KXXXXX WXXXXX";
EmployeeName[24]="JXXXXXXX WXXXXXX";
EmployeeName[25]="BXXX XXXXX";

var EmployeePin = new Array();
EmployeePin[1]="123";
EmployeePin[2]="123";
EmployeePin[3]="123";
EmployeePin[4]="123";
EmployeePin[5]="123";
EmployeePin[6]="123";
EmployeePin[7]="123";
EmployeePin[8]="123";
EmployeePin[9]="123";
EmployeePin[10]="123";
EmployeePin[11]="123";
EmployeePin[12]="123";
EmployeePin[13]="123";
EmployeePin[14]="123";
EmployeePin[15]="123";
EmployeePin[16]="123";
EmployeePin[17]="123";
EmployeePin[18]="123";
EmployeePin[19]="123";
EmployeePin[20]="123";
EmployeePin[21]="123";
EmployeePin[22]="123";
EmployeePin[23]="123";
EmployeePin[24]="123";
EmployeePin[25]="123";

var ItemCost = 0.0;
var ItemTax = 0.0;
var TotalNoTax = 0.0;
var TotalTax = 0.0
var TotalCost = 0.0
var Qty = 0; //Everything in JS is floating point, sadly
var ErrorState = false;
var EnteringPin = false;
var ClerkedIn = false;
var VoidMode = false;
var AddTax = true; //True unless 'Non-tax' is pressed
var ClerkId = 0;
var EnteredPin = "";
var PrevKeyId = "";
var NextPrevKeyId = "";
var NumKeyIds = ["1","2","3","4","5","6","7","8","9","0","00"];
var DeptKeyIds = ['PRINTING','26" LAMINA','12" LAMINA','PASSPORT','FAB 6 SURC','LATE FEE','CD DUPLICA','DVD DUPLIC','DVD AUTHOR','PREFLIGHT','USAGE FEES','POWERTABS','DVD MENU','COFFEE'];
var CommandKeyIds = ['Clear','Void','QTY'];
var PaymentKeyIds = ['PIN/CHECK','Subtotal','PAY CASH'];
var AuxiliaryKeys = ['Feed','Clerk ID'];
var FeeKeys = []; //todo: make these keys do something
var TaxKeys = []; //todo: make these keys do something
var KeyLog = []; //starts out with no keys

var ClerkingInKeys = NumKeyIds.concat(AuxiliaryKeys, 'Clear');
var EnteringPinKeys = NumKeyIds.concat('PIN/CHECK','Feed');
var ClerkedInKeys = NumKeyIds.concat(DeptKeyIds,CommandKeyIds,PaymentKeyIds,AuxiliaryKeys,FeeKeys,TaxKeys);

var AcceptableKeyIds = ClerkingInKeys; //at the beginning, all you can do is clerk in

var TaxRate = 0.06875;
//or this? const TaxRate = 0.06875;

var ItemPrice = new Array();
ItemPrice['PRINTING']='0.50';
ItemPrice['26" LAMINA']='1.50'; //todo:find this out
ItemPrice['12" LAMINA']='0.15';
ItemPrice['PASSPORT']='5.00';
ItemPrice['FAB 6 SURC']='25.00';
ItemPrice['LATE FEE']='0.12';
ItemPrice['CD DUPLICA']='4.00';
ItemPrice['DVD DUPLIC']='5.00';
ItemPrice['DVD AUTHOR']='50.00';
ItemPrice['PREFLIGHT']='10.00';
ItemPrice['USAGE FEES']='0.14';
ItemPrice['POWERTABS']='1.00';
ItemPrice['DVD MENU']='30.00';
ItemPrice['COFFEE']='0.50';

var ReceiptFirstHalf = new Array();
ReceiptFirstHalf['PRINTING']='PRINTING<span class="right-side">*';
ReceiptFirstHalf['26" LAMINA']=''; //todo:find this out
ReceiptFirstHalf['12" LAMINA']='12" LAMINATE<span class="right-side">*';
ReceiptFirstHalf['PASSPORT']='PASSPORT<span class="right-side">*';
ReceiptFirstHalf['FAB 6 SURC']='FAB 6 SURCHG<span class="right-side">*';
ReceiptFirstHalf['LATE FEE']='LATE FEE<span class="right-side">*';
ReceiptFirstHalf['CD DUPLICA']='CD DUPLICAT<span class="right-side">*';
ReceiptFirstHalf['DVD DUPLIC']='DVD DUPLICAT<span class="right-side">*';
ReceiptFirstHalf['DVD AUTHOR']='DVD AUTHORIN<span class="right-side">*';
ReceiptFirstHalf['PREFLIGHT']='PREFLIGHT<span class="right-side">*';
ReceiptFirstHalf['USAGE FEES']='USAGE FEES<span class="right-side">*';
ReceiptFirstHalf['POWERTABS']='POWERTABS<span class="right-side">*';
ReceiptFirstHalf['DVD MENU']='DVD MENU<span class="right-side">*';
ReceiptFirstHalf['COFFEE']='COFFEE<span class="right-side">*';
var ReceiptSecondHalf = new Array();
ReceiptSecondHalf['PRINTING']='T1</span>';
ReceiptSecondHalf['26" LAMINA']=''; //todo:find this out
ReceiptSecondHalf['12" LAMINA']='T1</span>';
ReceiptSecondHalf['PASSPORT']='T1</span>';
ReceiptSecondHalf['FAB 6 SURC']='T1</span>';
ReceiptSecondHalf['LATE FEE']='&nbsp;&nbsp;</span>';
ReceiptSecondHalf['CD DUPLICA']='T1</span>';
ReceiptSecondHalf['DVD DUPLIC']='T1</span>';
ReceiptSecondHalf['DVD AUTHOR']='T1</span>';
ReceiptSecondHalf['PREFLIGHT']='T1</span>';
ReceiptSecondHalf['USAGE FEES']='&nbsp;&nbsp;</span>';
ReceiptSecondHalf['POWERTABS']='T1</span>';
ReceiptSecondHalf['DVD MENU']='T1</span>';
ReceiptSecondHalf['COFFEE']='&nbsp;&nbsp;</span>';
function InArray(Element, Array) {
    for (var i in Array) {
        if (Array[i] == Element) {
            return true;
        }
    }
    return false;
}
function Debug() {
    alert(
    "ItemCost = "+ItemCost+"\n"+
    "ItemTax = "+ItemTax+"\n"+
    "TotalNoTax = "+TotalNoTax+"\n"+
    "TotalTax = "+TotalTax+"\n"+
    "TotalCost = "+TotalCost+"\n"+
    "Qty = "+Qty+"\n"+
    "ErrorState = "+ErrorState+"\n"+
    "EnteringPin = "+EnteringPin+"\n"+
    "ClerkedIn = "+ClerkedIn+"\n"+
    "VoidMode = "+VoidMode+"\n"+
    "AddTax = "+AddTax+"\n"+
    "ClerkId = "+ClerkId+"\n"+
    "EnteredPin = "+EnteredPin+"\n"+
    "PrevKeyId = "+PrevKeyId+"\n"+
    "VoidMode = "+VoidMode+"\n"+
    "NextPrevKeyId = "+NextPrevKeyId+"\n"+
    "AcceptableKeyIds = "+AcceptableKeyIds+"\n"+
    "KeyLog = "+KeyLog+"\n"   
    );
}
    
/***********************************************************************
Displays
customer-display-upper
    Displays information, including employee names and item names. The 
    manual calls this the operator display.
customer-display-lower
    Currently only a span used to enclose the lower-left and lower-right
    spans.
customer-display-lower-left
    Displays single characters like ".S" ".E" ".C" and KeyNum. This is 
    half of what the manual calls the numeric display.
customer-display-lower-right
    Displays entered values, subtotals, and the like.
***********************************************************************/
function AppendDisplay(DisplayName, HTML) {
    document.getElementById(DisplayName).innerHTML += HTML;
    //todo:scroll receipt down to active part so it can be seen
}
function SetDisplay(DisplayName, HTML) {
    document.getElementById(DisplayName).innerHTML = HTML;
}
function ClearDisplay(DisplayName) {
    document.getElementById(DisplayName).innerHTML = "";
}
function ParseDollars() {
    return parseFloat((document.getElementById('customer-display-lower-right').innerHTML) / 100.00);
}
function ParseNum() {
    return parseInt((document.getElementById('customer-display-lower-right').innerHTML));
}
function PrintReceiptItem(KeyId, ItemCost) {
    AppendDisplay('receipt', '<div class="receipt-items">'+ReceiptFirstHalf[KeyId]+ItemCost.toFixed(2)+ReceiptSecondHalf[KeyId]+'<br></div>');
}
function PrintReceiptRightAlign(Text) {
    AppendDisplay('receipt', '<div class="receipt-right-align">'+Text+'&nbsp;<br></div>');
}
function PrintReceiptHeader(EmployeeName) {
    AppendDisplay('receipt', '<div class="receipt-header">MEDIA SERVICES<br>Olin Hall room 032<br>507 933 7459<br>mediaservices@gac.edu<br><br><br><br></div>');
    var now = new Date();
    var DateStr = now.getMonth() + "-" + now.getDate() + "-" + now.getFullYear();
    AppendDisplay('receipt', '<div class="receipt-clerkin">'+DateStr+'<span class="right-side">MC #:0000&nbsp;&nbsp;</span><br>'+EmployeeName+'<br></div>');
}
function PrintReceiptTotals(PaymentType, Total, AmountPaid, Change) {
    if (AddTax === true) {
        AppendDisplay('receipt', '<div class="receipt-right-align>*'+TotalTax.toFixed(2)+'T1</div>');
    }
    AppendDisplay('receipt',
                '<div class="receipt-totals">------------------------<br>'+
                '<b>TOTAL</b><span class="right-side">*'+Total.toFixed(2)+'&nbsp;&nbsp;</span><br>'+
                PaymentType+'<span class="right-side">*'+AmountPaid.toFixed(2)+'&nbsp;&nbsp;</span><br>'+
                'CHANGE<span class="right-side">*'+Change.toFixed(2)+'&nbsp;&nbsp;</span><br></div>');
}
function PrintReceiptFooter() {
    var now = new Date();
    var TimeStamp = ""
    if (now.getHours < 12) TimeStamp+="AM ";
    else                   TimeStamp+="PM ";
    TimeStamp += (now.getHours() % 12) + "-" + now.getMinutes();
    AppendDisplay('receipt', '<div class="receipt-timestamp">'+TimeStamp+'&nbsp;&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;<br></div>');
    AppendDisplay('receipt', '<div class="receipt-footer">Thank you for visiting! <br>Please let us know how <br>we are doing.</div>');
}
function PlayErrorTone() {
    document.getElementById('ErrorTone').play();
}
function StopErrorTone() {
    document.getElementById('ErrorTone').pause();
    document.getElementById('ErrorTone').currentTime = 0;
}
function ThrowCashRegError(ErrorName) {
    ErrorState = true;
    SetDisplay('customer-display-upper', ErrorName);
    SetDisplay('customer-display-upper', ErrorName);
    SetDisplay('customer-display-lower-left', '.E');
    PlayErrorTone();
}
function Checkout(PaymentType) {
    //calculate change, update displays and receipt, clock out
    var Received = ParseDollars();
    if (AddTax === true) {
        TotalCost = TotalNoTax + TotalTax;
    }
    else {
        TotalCost = TotalNoTax;
    }
    if (Received < TotalCost) {
        ThrowCashRegError('ERR'); //TODO: check what the actual error is
    }
    else {
        var Change = Received - TotalCost;
        SetDisplay('customer-display-upper', 'CHANGE');
        SetDisplay('customer-display-lower-left', '.C');
        SetDisplay('customer-display-lower-right', Change.toFixed(2));
        PrintReceiptTotals(PaymentType, TotalCost, Received, Change);
        PrintReceiptFooter();
        SetDisplay('big-button-container','<button class="cash-drawer" onClick="CloseCashDrawer()">Close Cash Drawer</button>');
        AcceptableKeyIds = []; //TODO: check what really happens if you press a button with the drawer open
    }
}
function CloseCashDrawer() {
    ClearDisplay('big-button-container');
    SetDisplay('customer-display-lower-left', '');
    SetDisplay('customer-display-lower-right', 'PLEASE TAKE RECEIPT');
    //TODO: sleep 10 seconds, then go back to HELLO
    //also, check concurrency issues
    ClerkedIn = false;
    AcceptableKeyIds = ClerkingInKeys;
    KeyLog = []
}
function PressKey(KeyId, KeyNum) {
    KeyLog.push(KeyId);
    if (KeyId == "Clear Receipt") {
        ClearDisplay('receipt');
        return true;
    }
    
    PrevKeyId = NextPrevKeyId; //I could do this at the end, but that would mean restructuring the whole flow
    NextPrevKeyId = KeyId;
    if (KeyNum === undefined) {//KeyNum is optional, since only dept-keys have them
        KeyNum = "";
    }
    if (ErrorState === true) {
        if (KeyId == "Clear") {
            ErrorState = false;
            StopErrorTone();
            ClearDisplay('customer-display-upper');
            ClearDisplay('customer-display-lower-left');
            ClearDisplay('customer-display-lower-right');
            if (EnteringPin === true) {
                EnteringPin = false;
                EnteredPin = "";
                AcceptableKeyIds = ClerkingInKeys;                
            }
            return true;
        }
        else {
            return false;
        }
    }
    if ( !InArray(KeyId, AcceptableKeyIds) ) {
        ThrowCashRegError('ERROR')
        return false;
    }

    if (InArray(KeyId, NumKeyIds)) {//numerical keypad
        if (!InArray(PrevKeyId, NumKeyIds)) { //clear the displays if the previous key wasn't a number
            ClearDisplay('customer-display-upper');
            ClearDisplay('customer-display-lower-left');
            ClearDisplay('customer-display-lower-right');
        }
        if (EnteringPin === true) {
            EnteredPin += KeyId;
            AppendDisplay('customer-display-lower-right', '*');
        }
        else {
            AppendDisplay('customer-display-lower-right', KeyId);
        }
        return true;
    }
    if (InArray(KeyId, DeptKeyIds) && ClerkedIn === true) {//item keys, aka dept keys
        //ring up an item
        SetDisplay('customer-display-upper', KeyId);
        SetDisplay('customer-display-lower-left', KeyNum);
        if (PrevKeyId === "QTY") {
            ItemCost = parseFloat(ItemPrice[KeyId]) * Qty;
            SetDisplay('customer-display-lower-right',ItemPrice[KeyId]*Qty);
            PrintReceiptRightAlign(ItemPrice[KeyId]+'@');
        }
        else if (InArray(PrevKeyId, NumKeyIds)){
            //price override, e.g. printing
            ItemCost = parseFloat(document.getElementById('customer-display-lower-right').innerHTML) / 100.00;
        }
        else { //only one of the item
            Qty = 1;
            ItemCost = parseFloat(ItemPrice[KeyId]) * Qty;
            SetDisplay('customer-display-lower-right',ItemPrice[KeyId]);
        }
        if (AddTax === true) {
            ItemTax = ItemCost * TaxRate;
        }
        if (VoidMode == true) {
            //TODO: make VoidReceiptItem function that behaves differently
            PrintReceiptItem(KeyId, -1*ItemCost);
            TotalNoTax -= ItemCost;
            if (AddTax === true) {
                TotalTax -= ItemTax;
            }
            VoidMode = false;
        }
        else {
            PrintReceiptItem(KeyId, ItemCost);
            TotalNoTax += ItemCost;
            if (AddTax === true) {
                TotalTax += ItemTax;
            }
        }
        return true;
    }
    switch(KeyId) {//todo: set acceptable key ids for clear
        case "QTY" :
            if (InArray(PrevKeyId,NumKeyIds)) {
                Qty = parseInt(PrevKeyId);
                PrintReceiptRightAlign(Qty+'x');
            }
            else {
                ThrowCashRegError('ERROR')
                alert("Previous key was not a number.");
                return false;
            }
            break;
        case "Clear" : //no error clearing functions at this point
            ClearDisplay('customer-display-upper');
            ClearDisplay('customer-display-lower-left');
            ClearDisplay('customer-display-lower-right');
            EnteredPin = "";
            Qty = 0;
            break;
        case "Void" :
            //todo: figure out this whole business 
            AppendDisplay('receipt', 'VOID/CORR<br>');
            if (PrevKeyId == "Clear") {
                SetDisplay('customer-display-upper', 'VOID/CORR');
                VoidMode = true; //Now, when an item is entered, it will void it instead
            }
            else if(InArray(PrevKeyId, DeptKeyIds)) {
                //void current item
                SetDisplay('customer-display-upper', 'VOID/CORR');
                TotalNoTax -= ItemCost;
                //TODO: figure out voiding on receipts
                PrintReceiptItem(PrevKeyId, -1*ItemCost);
            }
            else {
                ThrowCashRegError("ERR");
                alert("Incorrect use of void.");
            }
            break;
        case "Feed" :
            AppendDisplay('receipt', '<br>');
            break;
        case "Non-tax":
            AddTax = false;
            TotalTax = 0.0;
            //This appears to be a global effect, i.e. no tax for the whole shebang.
            //TODO: check if it can be applied item by item.
        case "Clerk ID" :
            ClerkId = ParseNum();
            //TODO: check to make sure it is in the range 1 to 31 or whatever
            if ( !isNaN(ClerkId) && ClerkId > 0 && ClerkId < EmployeeName.length) {
                ClearDisplay('customer-display-upper');
                SetDisplay('customer-display-lower-right','0.00');
                EnteringPin = true;
                AcceptableKeyIds = EnteringPinKeys;
            }
            else {
                ThrowCashRegError("ERR");
                alert("Could not recognize ID: "+ClerkId);
            }
            break;
        case "PIN/CHECK" :
            if (EnteringPin === true && ClerkedIn === false && (EnteredPin === EmployeePin[ClerkId])) {
                SetDisplay('customer-display-upper', EmployeeName[ClerkId]);
                SetDisplay('customer-display-lower-left',ClerkId);
                SetDisplay('customer-display-lower-right','0.00');
                PrintReceiptHeader(EmployeeName[ClerkId]);
                ClerkedIn = true;
                EnteringPin = false;
                AcceptableKeyIds = ClerkedInKeys;
            }
            else {
                if (EnteringPin === true && ClerkedIn === false && (EnteredPin !== EmployeePin[ClerkId])) {
                        EnteringPin = false;
                        ThrowCashRegError('RE-CLERKB');
                        return false;
                }
                else {
                    if (ClerkedIn === true) {
                        Checkout("CHECK");
                    }
                }
            }
            break;
        case "Subtotal" :
            if (ClerkedIn === true) {
                //print out the current total; do nothing to receipt
                SetDisplay('customer-display-upper', 'SUBTTL');
                SetDisplay('customer-display-lower-left','.S');
                if (AddTax === true) {
                    DisplayTotal = TotalNoTax+TotalTax;
                }
                else {
                    DisplayTotal = TotalNoTax;
                }
                SetDisplay('customer-display-lower-right', DisplayTotal.toFixed(2));
            }
            break;
        case "PAY CASH" :
            if (ClerkedIn === true) {
                Checkout("AMOUNT");
            }
            break;
        default :
            alert("Programming Error: An incorrectly handled key has been pressed with id: "+KeyId);
        return true; //switch statement ends here
    }
}
