export type LibreplexLegacy = {
  "version": "0.0.0",
  "name": "libreplex_legacy",
  "instructions": [
    {
      "name": "inscribeLegacyMetadataAsUauth",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "legacySigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionRanksCurrentPage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionRanksNextPage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "legacyMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "validationHash",
          "type": "string"
        }
      ]
    },
    {
      "name": "inscribeLegacyMetadataAsHolder",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "secondSignature",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "cannot inscribe any old garbage.  Second signature",
            "is used to provide a validation hash that is consistent",
            "with the legacy offline content"
          ]
        },
        {
          "name": "legacySigner",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionRanksCurrentPage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionRanksNextPage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "legacyMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "validationHash",
          "type": "string"
        }
      ]
    },
    {
      "name": "writeToLegacyInscriptionAsHolder",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "WriteToLegacyInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "resizeLegacyInscriptionAsUauth",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "legacyMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "ResizeLegacyInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "resizeLegacyInscriptionAsHolder",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "ResizeLegacyInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "makeImmutable",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setValidationHash",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "validationHash",
          "type": {
            "option": "string"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "legacyInscription",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "inscription",
            "type": "publicKey"
          },
          {
            "name": "legacyType",
            "type": {
              "defined": "LegacyType"
            }
          },
          {
            "name": "authorityType",
            "type": {
              "defined": "AuthorityType"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ResizeLegacyInscriptionInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "change",
            "type": "i32"
          },
          {
            "name": "expectedStartSize",
            "type": "u32"
          },
          {
            "name": "targetSize",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "WriteToLegacyInscriptionInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "data",
            "type": "bytes"
          },
          {
            "name": "startPos",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "AuthorityType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Holder"
          },
          {
            "name": "UpdateAuthority"
          }
        ]
      }
    },
    {
      "name": "LegacyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "MetaplexMint"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "BadMint",
      "msg": "Metadata has a bad mint"
    },
    {
      "code": 6001,
      "name": "CannotInscribeFungible",
      "msg": "Cannot inscribe a fungible asset"
    },
    {
      "code": 6002,
      "name": "BadAuthority",
      "msg": "Bad authority"
    },
    {
      "code": 6003,
      "name": "BadAuthorityForHolderInscription",
      "msg": "Bad authority for holder inscription"
    },
    {
      "code": 6004,
      "name": "BadAuthorityForUpdateAuthInscription",
      "msg": "Bad authority for update auth inscription"
    }
  ]
};

export const IDL: LibreplexLegacy = {
  "version": "0.0.0",
  "name": "libreplex_legacy",
  "instructions": [
    {
      "name": "inscribeLegacyMetadataAsUauth",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "legacySigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionRanksCurrentPage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionRanksNextPage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "legacyMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "validationHash",
          "type": "string"
        }
      ]
    },
    {
      "name": "inscribeLegacyMetadataAsHolder",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "secondSignature",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "cannot inscribe any old garbage.  Second signature",
            "is used to provide a validation hash that is consistent",
            "with the legacy offline content"
          ]
        },
        {
          "name": "legacySigner",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionRanksCurrentPage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionRanksNextPage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "legacyMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "validationHash",
          "type": "string"
        }
      ]
    },
    {
      "name": "writeToLegacyInscriptionAsHolder",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "WriteToLegacyInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "resizeLegacyInscriptionAsUauth",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "legacyMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "ResizeLegacyInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "resizeLegacyInscriptionAsHolder",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "ResizeLegacyInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "makeImmutable",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setValidationHash",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "legacyInscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "legacy_inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "validationHash",
          "type": {
            "option": "string"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "legacyInscription",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "inscription",
            "type": "publicKey"
          },
          {
            "name": "legacyType",
            "type": {
              "defined": "LegacyType"
            }
          },
          {
            "name": "authorityType",
            "type": {
              "defined": "AuthorityType"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ResizeLegacyInscriptionInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "change",
            "type": "i32"
          },
          {
            "name": "expectedStartSize",
            "type": "u32"
          },
          {
            "name": "targetSize",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "WriteToLegacyInscriptionInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "data",
            "type": "bytes"
          },
          {
            "name": "startPos",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "AuthorityType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Holder"
          },
          {
            "name": "UpdateAuthority"
          }
        ]
      }
    },
    {
      "name": "LegacyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "MetaplexMint"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "BadMint",
      "msg": "Metadata has a bad mint"
    },
    {
      "code": 6001,
      "name": "CannotInscribeFungible",
      "msg": "Cannot inscribe a fungible asset"
    },
    {
      "code": 6002,
      "name": "BadAuthority",
      "msg": "Bad authority"
    },
    {
      "code": 6003,
      "name": "BadAuthorityForHolderInscription",
      "msg": "Bad authority for holder inscription"
    },
    {
      "code": 6004,
      "name": "BadAuthorityForUpdateAuthInscription",
      "msg": "Bad authority for update auth inscription"
    }
  ]
};
