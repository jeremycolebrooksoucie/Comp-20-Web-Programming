Jeremy Colebrook-Soucie

All portions of assignment have been correctly implemented

I worked with only myself

Hours spent: 1

Is it possible to request the data from a different origin or from your local machine using XMLHttpRequest? Why or why not?
It is not possible to do this due to the same origin policy. XMLHttpRequest can only make requests to the same domain that is hosting the site that is making the request. For instance, the request failed when the html running in browser tried to make a request to the file system (functionally a different domain) due to the same origin policy. The request to an outside server failed similiarly. 