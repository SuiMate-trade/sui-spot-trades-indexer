import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';
const firebaseConfig = {
    credential: admin.credential.cert({
        projectId: 'copy-trade-on-sui',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCz76+CAakvQ5RO\ngXJSSrEGXALC3t2GH+popkX9m9wgnscqcIQY5+eR65sktOJRZDx2H9xIVWYSagkH\n5fTMr+f2u+zolqwygSpdaWx+QbFJSW0vnXin8y9pO0bzxwY9GE/VkeLF2mbQOOhx\nVBatnXvWTYRFwZjfcUnxVjHtWUniMLa1qiC/vIi+73r0Z79CWBxLKBNmWimJGhHn\nJfE/xUfLG4WSN7jfeMXJgOIZ0NHSBiEA0TgJ197K5OVHrrFnbbeXqTn2h0zSaJH9\nKYankX6/ImMw9Q1I/paET3Yx7WJ3yGvVY5xFc8mUwDF0yICrpzY95HS+lwk5QeiT\nwdwPDF2xAgMBAAECggEABdNzcgY0/hsQwsZ28cJp7y1nPaaa6FWhS2cNJ4LGhWFd\nYZVv94D5utwqA1hz0U6+1OnKQibOtbcByMP5sZoaof7lcwX0OHSSxIsYwyaZc4ik\nDK7An3p/TQepRVR1kktBWXueNV8GusRJmr1uOGFGcf1uScEUvrEDuS5RPUYUSfV7\nrlRvMrbcmWtrhJ0cW4IaTMUIkMpVoRSf6lSQj+os4DfW8bQl2yKqIdfZKcqhnn9E\nGUBI08HJl2hmepI0zqaHaL+vd3ZgVRommlzBbc9xUFvSNfuX3hXM6qhd4xRNWpUX\nhel6Hb13R7HBD3s08ruz524r55sJkzYnj6W/K0xBKQKBgQD56wPMSiSmZ32xKNMX\nHQ/DpeDrJ9GR0iO0XdUxkaO+MZ3KwmkCnMGAlcaebqvam5NN28Dd/zs7y6e2xidc\nWYbpw7KoqFAU5vHGqxJWZOcfGEK8qAGR6A2QNozIHkoLrNlEkOHhsZYml0dphX0r\nu7+QKgJ+URe+SWthrVvLJ55WmQKBgQC4UK+BZ/qAmgb2DVsfnk7Ev1EZmOmW59PT\novHJCZ2EyWVMzMpTj3KTsdUTlyR0I20HAl94HJ/IG0EdwpadApnZ/plhPx0wc9pw\n4HjDivYfZJ/Kq9IOgwSeb1h1T31N45t1n/wIVg5spWh7x8qjmUemLqgHS14A6EKS\nAMHeFnRm2QKBgQDAyib35Qo4xAUWMSQF5IlQqBnFzcXA85ZPgUMBJhRml+fdjfNr\n7HjpNKEvfrhbvz/3A9rYZhfPnN8YA+xBNV753dloec6tESrZ0wYmV1hjiFeTKRds\n8tHjufEIPzVnpENGvW1CqbfmtTSFllBk+ERidcXOo8fpJsILa6wwH7PpoQKBgQCD\n+VIRqLAXkTJW0C1lMGdaPVsGpxTq9sgYC95wgrAFOmeMXD6rIlV6J6VYR6rUdeFF\nWY+eY3CNSeaQNpq9hfU/wCt3FEgEP5AzrqcJ7OBajiRUbD8WIP4Xq8Z9CRPBx62y\nxYEjPutJJA7yQpZ4GfLRrSqnPnHq2GOCQ4SNTyq90QKBgFgLHA7iCnPuCvnjY07L\nMYKoTO66D2mrNufi77ZjRJHsgDpdKXiWiBLj4YLJaCQYsiSLcpJJEMy2wp1pD5L1\nE2pDBNIWeRJspY6kToP+9ZnDFRVsMPkbsFKTua35MQ/2vDQ9oQ6sAlPJDH6VmwnJ\n/x/VbOqlGcemGCa0BA0MyFRr\n-----END PRIVATE KEY-----\n',
        clientEmail: 'firebase-adminsdk-uqe7b@copy-trade-on-sui.iam.gserviceaccount.com',
    }),
    databaseURL: 'https://copy-trade-on-sui-default-rtdb.asia-southeast1.firebasedatabase.app/',
};
// Initialize Firebase
const app = admin.apps.length
    ? admin.app()
    : admin.initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const rtdb = getDatabase(app);
export { firestore, rtdb };
export default app;
//# sourceMappingURL=firebase.js.map