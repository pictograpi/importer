"use strict";

module.exports = (() => {
  const replace = require("replace");
  const shell = require("shelljs");
  const path = require("path");
  const file = path.resolve("../tmp", "images.xml");

  // Backup the file.
  shell.cp(file, `${file}_BACKUP`);

  const replacements = [{
      regex: "<language>Castellano</language>",
      replacement: '<language code="es-ES" name="spanish - spain"></language>'
    },
    {
      regex: "<language>Ingles</language>",
      replacement: '<language code="en-GB" name="english - united kingdom"></language>'
    },
    {
      regex: "<language>Frances</language>",
      replacement: '<language code="fr-FR" name="french - france"></language>'
    },
    {
      regex: "<language>Catalan</language>",
      replacement: '<language code="ca-ES" name="catalan - catalan"></language>'
    },
    {
      regex: "<language>Italiano</language>",
      replacement: '<language code="it-IT" name="italian - italy"></language>'
    },
    {
      regex: "<language>Aleman</language>",
      replacement: '<language code="de-DE" name="german - germany"></language>'
    },
    {
      regex: "<language>Portugues</language>",
      replacement: '<language code="pt-PT" name="portuguese"></language>'
    },
    {
      regex: "<language>Portugues Brasil</language>",
      replacement: '<language code="pt-BR" name="portuguese - brazil"></language>'
    },
    {
      regex: "<language>Gallego</language>",
      replacement: '<language code="gl-ES" name="galician - galician"></language>'
    },
    {
      regex: "<language>Euskera</language>",
      replacement: '<language code="eu-ES" name="basque - basque"></language>'
    },
    {
      regex: "</languages>",
      replacement: `
      </languages>
      <types>
        <type code="common-noun" name="common noun"></type>
        <type code="adjective" name="adjective"></type>
        <type code="verb" name="verb"></type>
        <type code="miscellanea" name="miscellanea"></type>
        <type code="proper-noun" name="proper noun"></type>
        <type code="social" name="social"></type>
      </types>
      `
    }
  ];

  replacements.forEach(({
      regex,
      replacement
    }) =>
    replace({
      regex,
      replacement,
      paths: [file]
    })
  );

  replace({
    regex: "<language>Castellano</language>",
    replacement: '<language code="es-ES" name="spanish - spain"></language>',
    paths: [file]
  });

  replace({
    regex: "<language>Ingles</language>",
    replacement: '<language code="en-GB" name="english - united kingdom"></language>',
    paths: [file]
  });

  replace({
    regex: "<language>Frances</language>",
    replacement: '<language code="fr-FR" name="french - france"></language>',
    paths: [file]
  });

  replace({
    regex: "<language>Frances</language>",
    replacement: '<language code="fr-FR" name="french - france"></language>',
    paths: [file]
  });

  replace({
    regex: 'id="Castellano"',
    replacement: 'code="es-ES"',
    paths: [file]
  });

  replace({
    regex: 'id="Ingles"',
    replacement: 'code="en-GB"',
    paths: [file]
  });

  replace({
    regex: 'id="Frances"',
    replacement: 'code="fr-FR"',
    paths: [file]
  });

  replace({
    regex: 'id="Catalan"',
    replacement: 'code="ca-ES"',
    paths: [file]
  });

  replace({
    regex: 'id="Italiano"',
    replacement: 'code="it-IT"',
    paths: [file]
  });

  replace({
    regex: 'id="Aleman"',
    replacement: 'code="de-DE"',
    paths: [file]
  });

  replace({
    regex: 'id="Portugues"',
    replacement: 'code="pt-PT"',
    paths: [file]
  });

  replace({
    regex: 'id="Portugues Brasil"',
    replacement: 'code="pt-BR"',
    paths: [file]
  });

  replace({
    regex: 'id="Gallego"',
    replacement: 'code="gl-ES"',
    paths: [file]
  });

  replace({
    regex: 'id="Euskera"',
    replacement: 'code="eu-ES"',
    paths: [file]
  });

  replace({
    regex: 'type="nombreComun"',
    replacement: 'type="common-noun"',
    paths: [file]
  });

  replace({
    regex: 'type="descriptivo"',
    replacement: 'type="adjective"',
    paths: [file]
  });

  replace({
    regex: 'type="verbo"',
    replacement: 'type="verb"',
    paths: [file]
  });

  replace({
    regex: 'type="miscelanea"',
    replacement: 'type="miscellanea"',
    paths: [file]
  });

  replace({
    regex: 'type="nombrePropio"',
    replacement: 'type="proper-noun"',
    paths: [file]
  });

  replace({
    regex: 'type="contenidoSocial"',
    replacement: 'type="social"',
    paths: [file]
  });
})();