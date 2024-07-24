import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAyTNs5FQxsCtjP3HcSwBbtq2DvKp1CWWQ',
  authDomain: 'quizzzy-plus.firebaseapp.com',
  projectId: 'quizzzy-plus',
  storageBucket: 'quizzzy-plus.appspot.com',
  messagingSenderId: '403474519501',
  appId: '1:403474519501:web:82cfabebbd8beaea53e084',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
