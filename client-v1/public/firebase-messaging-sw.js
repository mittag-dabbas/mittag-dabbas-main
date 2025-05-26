importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
	apiKey: 'AIzaSyCnNw-NjPZmNiz1Tsl3X1zRKg99KdeUuow',
	authDomain: 'mittag-dabbas-94b49.firebaseapp.com',
	projectId: 'mittag-dabbas-94b49',
	storageBucket: 'mittag-dabbas-94b49.firebasestorage.app',
	messagingSenderId: '947548511746',
	appId: '1:947548511746:web:bd56cf38ffa5899c14111b',
	measurementId: 'G-8D7K8DV1PJ'
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
	self.registration.showNotification(payload.notification.title, {
		body: payload.notification.body,
		icon: '/icon.png'
	});
});
