self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/apple-icon.png",
      badge: data.badge || "/apple-icon.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "1",
        url: data.data?.url || "/",
        factId: data.data?.factId,
      },
      actions: [
        {
          action: "read",
          title: "Get it now",
          icon: "/apple-icon.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/apple-icon.png",
        },
      ],
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Helper function to get the user's locale from browser or default to 'en'
function getUserLocale() {
  const supportedLocales = ["en", "el"]; // Add your supported locales here
  const browserLang =
    self.navigator.language || self.navigator.languages[0] || "en";
  const locale = browserLang.split("-")[0]; // Get the primary language code
  return supportedLocales.includes(locale) ? locale : "en";
}

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");

  event.notification.close();

  const userLocale = getUserLocale();

  if (event.action === "read") {
    // Open the app and navigate to the specific fact if available
    const url = event.notification.data.factId
      ? `/${userLocale}?factId=${event.notification.data.factId}`
      : `/${userLocale}`;

    event.waitUntil(
      clients.matchAll().then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  } else if (event.action === "close") {
    // Just close the notification (already done above)
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll().then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(`/${userLocale}`);
        }
      })
    );
  }
});

self.addEventListener("notificationclose", function (event) {
  console.log("Notification closed:", event.notification.tag);
  // You can track notification dismissals here if needed
});
