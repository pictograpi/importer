# pictograpi-importer

Welcome to the Pictograpi Importer project.

This project makes easier to create your own pictograph API from a ZIP file. It extracts the information from the ZIP and uses [Google Firebase](https://firebase.google.com) to store images and its data associated.

Once everything is imported inside Google Firebase you can use the [Firebase API](https://firebase.google.com/docs/) in any supported OS to request information needed about pictographs and images.

We hope this project will help you to develop your own projects.

Keep coding!

# Running considerations

Before running the importer you should take into account a pair of things:

* A full import will take several hours although it may be resumed.
* Importer is going to execute a lot of operations in Google Firebase. This may cause a "Quota exceeded" error. **We recommend to pay for [Blaze account](https://firebase.google.com/pricing/?authuser=0)** because otherwise Google Firebase will only allow 20.000 operations. An estimated cost for a full import is 2$-5$.

# 1. Configuring the importer

Follow these steps to configure and running the importer.

## 1.1. Create a Firebase account and a project

1.  Go to [Google Firebase](https://firebase.google.com)
2.  Click on Sing in and use your Google Account or create one.
3.  Click on Add Project and choose a name for your project.

## 1.2. Download sign in information from Firebase

1.  From your Firebase Admin panel, click on the gear icon on the sidebar and _Project Configuration_
2.  Click on the tab _Service Accounts_
3.  Press the button _Generate new private key_ and save the file downloaded

## 1.3. Obtain storage bucket name

1.  In your Firebase Admin panel, click on _Storage_ and _Start_.
2.  Copy the name of the bucket **without** the `gs://`.

## 1.4. Configure the importer

1.  Copy the JSON file downloaded in the step 2 into the root folder of the project.
2.  Create a file `./.env` and fill it with this information:

```
FIREBASE_ACCOUNT_KEY=_relative path to the JSON file_
FIREBASE_STORAGE_BUCKET=_bucket name obtained in step 3_
```

It should like like this:

```
FIREBASE_ACCOUNT_KEY=./pictograpi-test-firebase-adminsdk-12345.json
FIREBASE_STORAGE_BUCKET=pictograpi-test-b18c5.appspot.com
```

# 2. Executing the importer

The importer uses npm tasks for its execution. These steps are described for MacOS. **Environment variables may be configured differently in other OS.**

## 2.1 Install dependencies

Use `npm install` to install all dependencies.

## 2.2 Running the importer

The importer supports different tasks depending on your needs.

### Runing a full import

This command will run a full import of everything found in the ZIP file.

```
# env ZIP=./path-to-zip-file.zip npm run importer
# For example:

env ZIP=../../Documents/pictos.zip npm run importer
```

A full log will be created in the file `./importer-debug.log`.

### Resuming previous execution

If something goes wrong or you split the execution in batches, you may use this command.

```
# env ZIP=./path-to-zip-file.zip CONTINUE=image-id.png npm run importer
# For example:

env ZIP=../../Documents/pictos.zip CONTINUE=27591.png npm run importer
```

Using the previous command, the importer will continue from the image with id 27591.png.
