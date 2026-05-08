function BankAccount(name, accountNumber) {
    this.name = name;
    this.accountNumber = accountNumber;
    this.balance = 5000;
  }
  
  BankAccount.prototype.deposit = function(amount) {
    this.balance += amount;
    addTransaction(this.name, this.accountNumber, 'Deposit', amount);
  };
  
  BankAccount.prototype.withdraw = function(amount) {
    if (amount <= this.balance) {
      this.balance -= amount;
      addTransaction(this.name, this.accountNumber, 'Withdrawal', amount);
      return true;
    }
    return false;
  };
  
  BankAccount.prototype.getBalance = function() {
    return this.balance;
  };
  
  // Transaction History
  const transactions = [];
  
  function addTransaction(name, accountNumber, type, amount) {
    transactions.push({ name, accountNumber, type, amount });
  }
  
  // User Interface Logic
  let bankAccounts = [];
  
  function displayAccountDetails(account) {
    $("#accountDetails .name").text(account.name);
    $("#accountDetails .accountNumber").text(account.accountNumber);
    $("#accountDetails .balance").text('$' + account.getBalance().toFixed(2));
    $("#accountDetails").show();
  }
  
  function displayTransactionHistory() {
    let transactionList = $("#transactions");
    transactionList.empty();
    transactions.forEach(function(transaction) {
      transactionList.append(`<li>${transaction.name} (${transaction.accountNumber}): ${transaction.type} $${transaction.amount.toFixed(2)}</li>`);
    });
    $("#transactionHistory").show();
  }
  
  function displayTransactionDetails(transaction) {
    $("#transactionDetails .name").text(transaction.name);
    $("#transactionDetails .accountNumber").text(transaction.accountNumber);
    $("#transactionDetails .type").text(transaction.type);
    $("#transactionDetails .amount").text('$' + transaction.amount.toFixed(2));
    $("#transactionDetails").show();
  }
  
  function attachTransactionClickEvent() {
    $("#transactions").on("click", "li", function() {
      const transactionIndex = $(this).index();
      const transaction = transactions[transactionIndex];
      displayTransactionDetails(transaction);
    });
  }
  
  function displayInsufficientFundsMessage() {
    $("#insufficientFundsMessage").show();
  }
  
  function getSelectedAccount(accountNumber) {
    return bankAccounts.find(account => account.accountNumber === accountNumber);
  }
  
  $(document).ready(function() {
    $("form#bankForm").submit(function(event) {
      event.preventDefault();
      const name = $("#name").val();
      const accountNumber = $("#accountNumber").val();
      const transactionType = $("#transactionType").val();
      const amount = parseFloat($("#amount").val());
  
      let selectedAccount = getSelectedAccount(accountNumber);
  
      if (!selectedAccount) {
        selectedAccount = new BankAccount(name, accountNumber);
        bankAccounts.push(selectedAccount);
      }
  
      if (transactionType === 'deposit') {
        selectedAccount.deposit(amount);
      } else {
        const isWithdrawalSuccessful = selectedAccount.withdraw(amount);
        if (!isWithdrawalSuccessful) {
          displayInsufficientFundsMessage();
          return;
        }
      }
  
      displayAccountDetails(selectedAccount);
      displayTransactionHistory();
      attachTransactionClickEvent();
  
      // Clear input fields after transaction
      $("#name").val("");
      $("#accountNumber").val("");
      $("#amount").val("");
    });
  });
  function User(name,balance,email=""){
    this.name=name;
    this.balance=parseInt(balance);
    this.email=email;
    this.transaction_history=[];
}

function Transaction(operation,amount,balance,datetime){
    this.operation=operation;
    this.amount=amount;
    this.balance=balance;
    this.datetime=datetime;
}
setTimeout(function(){
  document.getElementById("createUser_status").innerHTML="";        
},2000);
function send(from_user,to_user,amount){
  fetchData();
  let sender_index=userExists(from_user);
  let receiver_index=userExists(to_user);

  if( sender_index>=0 && receiver_index>=0 && validAmtFormat(amount) && Users[sender_index].balance>=amount ){
      let amount_parsed=parseInt(amount);
      currentDatetime = getDatetime();

      Users[sender_index].balance-=amount_parsed;
      Users[sender_index].transaction_history.push( new Transaction("-",amount_parsed,Users[sender_index].balance,currentDatetime));

      Users[receiver_index].balance+=amount_parsed;
      Users[receiver_index].transaction_history.push( new Transaction("+",amount_parsed,Users[receiver_index].balance,currentDatetime));

      updateData();
      
      let transAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);
      document.getElementById("transaction_status").innerHTML="Transaction complete! "+transAmount+" transferred from "+from_user+" to "+to_user+"'s account";
      // document.getElementById("transaction_status").innerHTML="Transaction complete!";

      //send email notif to sender
      sendNotif(sender_index,"send",transAmount,currentDatetime,receiver_index);
      //send email notif to receiver
      sendNotif(receiver_index,"deposit",transAmount,currentDatetime);

      setTimeout(function(){
          document.getElementById("transaction_status").innerHTML="";
      },5000);  

  }else{
      alert("Send money action invalid! Check if users are valid and amount doesn't exceed sender's balance");
  }

}
function userExists(name){
  for(i=0;i<Users.length;i++){
      if(Users[i].name===name){
          return i;
      }
  }
  console.log("User "+name+" doesn't exist in Bank database");
  return -1;
}