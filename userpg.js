// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbcOiDEbh00C_inqFZbw2v-kAWwWC19Ws",
  authDomain: "wecash-a0756.firebaseapp.com",
  projectId: "wecash-a0756",
  storageBucket: "wecash-a0756.firebasestorage.app",
  messagingSenderId: "341614312585",
  appId: "1:341614312585:web:4b2fc6975d727eddf49a58",
  measurementId: "G-C700T0SBC9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
 
const loginDiv = document.getElementById('login');
const dashboardDiv = document.getElementById('dashboard');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
 
signupBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert('User registered!'))
    .catch(err => alert(err.message));
});
 
loginBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      loginDiv.style.display = 'none';
      dashboardDiv.style.display = 'block';
      userInfo.textContent = `Logged in as: ${user.email}`;
    })
    .catch(err => alert(err.message));
});

// Log out
logoutBtn.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      loginDiv.style.display = 'block';
      dashboardDiv.style.display = 'none';
    })
    .catch(err => alert(err.message));
});
import { getFirestore, collection, addDoc, query, where, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
const db = getFirestore(app);
// DOM elements
const transactionsDiv = document.getElementById('transactions');
const recipientInput = document.getElementById('recipient');
const amountInput = document.getElementById('amount');
const sendTransactionBtn = document.getElementById('sendTransaction');
const transactionList = document.getElementById('transactionList');

// Show transactions section after login
signInWithEmailAndPassword(auth, email, password).then(userCredential => {
  // (Inside the login success handler)
  transactionsDiv.style.display = 'block';
  loadTransactions(user.uid);
});
 
sendTransactionBtn.addEventListener('click', async () => {
  const recipient = recipientInput.value;
  const amount = parseFloat(amountInput.value);
  const user = auth.currentUser;

  if (!recipient || !amount || amount <= 0) {
    alert("Please enter a valid recipient and amount.");
    return;
  }

  try {
    await addDoc(collection(db, "transactions"), {
      sender: user.uid,
      recipient: recipient,
      amount: amount,
      timestamp: new Date(),
    });
    alert("Transaction successful!");
    recipientInput.value = '';
    amountInput.value = '';
  } catch (err) {
    alert("Transaction failed: " + err.message);
  }
});
 
function loadTransactions(userId) {
  const q = query(collection(db, "transactions"), where("sender", "==", userId));

  onSnapshot(q, (snapshot) => {
    transactionList.innerHTML = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement('li');
      li.textContent = `To: ${data.recipient}, Amount: $${data.amount.toFixed(2)}`;
      transactionList.appendChild(li);
    });
  });
}

document.querySelectorAll('.dropdown').forEach(dropdown => {
  dropdown.addEventListener('mouseenter', () => {
      dropdown.querySelector('.dropdown-menu').style.display = 'block';
  });
  dropdown.addEventListener('mouseleave', () => {
      dropdown.querySelector('.dropdown-menu').style.display = 'none';
  });
});
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /transactions/{transactionId} {
//       allow read, write: if request.auth != null && request.auth.uid == resource.data.sender;
//     }
//   }
// }
