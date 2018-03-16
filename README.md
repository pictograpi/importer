# pictograpi-importer

Welcome to the Pictograpi Importer project.

This project makes easier to create your own pictograph API from a ZIP file from [ARASAAC](http://www.arasaac.org). It extracts the information from the ZIP and uses [Google Firebase](https://firebase.google.com) to store images and its data associated.

Once everything is imported inside Google Firebase you can use the [Firebase API](https://firebase.google.com/docs/) in any supported OS to request information needed about pictographs and images.

We hope this project will help you to develop your own projects.

Keep coding!

# Table of contents

* [Installation](#installation)
* [Usage](#usage)
  * [Import pictographs](#import-pictographs)
  * [API Schema](#api-schema)
  * [Requesting the API](#requesting-the-api)
* [Credits](#credits)
* [License](#license)

# Installation

To start using this importer just clone/download the code and follow next steps. This project relays on NodeJS and NPM, make sure they are installed on your computer.

## Install dependencies

Run `npm install` to install all dependencies.

## Configure the importer

Follow these steps to configure and running the importer.

### 1.1. Create a Firebase account and a project

1.  Go to [Google Firebase](https://firebase.google.com)
2.  Click on Sing in and use your Google Account or create one.
3.  Click on Add Project and choose a name for your project.

### 1.2. Download sign in information from Firebase

1.  From your Firebase Admin panel, click on the gear icon on the sidebar and _Project Configuration_
2.  Click on the tab _Service Accounts_
3.  Press the button _Generate new private key_ and save the file downloaded

### 1.3. Obtain storage bucket name

1.  In your Firebase Admin panel, click on _Storage_ and _Start_.
2.  Copy the name of the bucket **without** the `gs://`.

### 1.4. Configure the importer

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

# Usage

Before running the importer you should take into account a pair of things:

* A full import will take several hours although it may be resumed.
* Importer is going to execute a lot of operations in Google Firebase. This may cause a "Quota exceeded" error. **We recommend to pay for [Blaze account](https://firebase.google.com/pricing/?authuser=0)** because otherwise Google Firebase will only allow 20.000 operations. An estimated cost for a full import is 2$-5$.
* The importer uses npm tasks for its execution. These steps are described for MacOS. **Environment variables may be configured differently in other OS.**

## Import pictographs

### Download pictographs

This task is separated into a different task because you just need to execute it once.

```
# env URL=url.zip npm run download
# For example:
env URL=https://cdn.pictograpi.com/pictographs.zip npm run download
```

To make this easier we have uploaded to the Pictograpi CDN some package of pictographs from ARASAAC. Use one of links below:

* Package 21/10/2016: https://cdn.pictograpi.com/api-assets/pictographs-21102016.zip

### Runing a full import

This command will run a full import of everything found in the ZIP file.

```
npm run importer-pictographs
```

A full log will be created in the file `./importer-debug.log`.

### Resuming previous execution

If something goes wrong or you split the execution in batches, you may use this command.

```
# env CONTINUE=image-id.png npm run importer-pictographs
# For example:

env CONTINUE=27591.png npm run importer-pictographs
```

Using the previous command, the importer will continue from the image with id 27591.png.

## Import verbs

This task imports a list of verbs into the database.

**It must be run after importing pictographs**

### Download verbs

This task will help you download a package of verbs.

```
# env URL=url.zip npm run download
# For example:
env URL=https://cdn.pictograpi.com/verbs.zip npm run download
```

To make this easier we have uploaded to the Pictograpi CDN a package of verbs. Use one URL below:

* Package 21/10/2016: https://cdn.pictograpi.com/api-assets/verbs-21102016.zip

### Running a full import

This command will run a full import of the verbs:

```
# env LANGUAGE=languageCode npm run importer-verbs
# For example:
env LANGUAGE=es-ES npm run importer-verbs
```

You should specify which language you want to import, **they are case sensitive.**

### Resuming previous execution

Importing verbs may fail or may be split into different task. You may use this command below:

```
# env CONTINUE="verb" npm run importer-verbs
# For example:
env CONTINUE="bailar" npm run importer-verbs
```

Put your verbs between commas. Previous command would continue importing from the verb bailar.

You may also modify the verbs file to remove all those verbs already included in the database.

## API Schema

Pictograpi Importer uses two things of Google Firebase:

* Firebase Storage: It is a cloud file storage that exposes the files through the Firebase API. These files may be accessed through the [Firebase Storage API](https://firebase.google.com/docs/storage/).
* Cloud Firestore: It is a NoSQL database that stores all pictograph information. This is the schema of the database:

```
{
  "images": [{
    "format": "(String) Format of the image. PNG, JPEG, etc.",
    "height": "(Number) Height of the image",
    "id": "(Number) Unique id of the image in the XML import file",
    "mimeType": "(String) mimetype of the image. image/png, image/jpeg, etc.",
    "storageId": "(String) Id referencing the image inside the Firebase Storage.",
    "width": "(Number) Width of the image."
  }],
  "languages": [{
    "code": "(String) Unique code of the language. es-ES, es-CA, etc.",
    "name": "(String) Humanize name of the language"
  }],
  "types": [{
    "code": "(String) Unique code of the type. adjective, common-noun, etc.",
    "name": "(String) Humanize name of the type"
  }],
  "words": [{
    "imageId": "(Number) Id referencing the image",
    "languageCode": "(String) Code referencing the language",
    "typeCode": "(String) Code referencing the type",
    "word": "(String) Word describing the pictograph"
  }]
}
```

## Requesting the API

The API generated may be requested using the Firebase API. Follow the [official documentation](https://firebase.google.com/docs/) for more information.

# Credits

This project is developed thanks to:

* [Pictograpi Team](https://pictograpi.com)
* [ARASAAC](http://arasaac.org)
* [UNIZAR](http://unizar.es)

# License

Attribution-NonCommercial-ShareAlike 3.0 Unported
