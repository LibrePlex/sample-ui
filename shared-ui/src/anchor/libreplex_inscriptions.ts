export type LibreplexInscriptions = {
  "version": "0.2.2",
  "name": "libreplex_inscriptions",
  "instructions": [
    {
      "name": "createInscriptionRankPage",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "page",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_rank"
              },
              {
                "kind": "arg",
                "type": {
                  "defined": "CreateInscriptionRankInput"
                },
                "path": "input.page_index"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "CreateInscriptionRankInput"
          }
        }
      ]
    },
    {
      "name": "makeInscriptionImmutable",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_summary"
              }
            ]
          }
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createInscription",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "root",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_summary"
              }
            ]
          }
        },
        {
          "name": "inscriptionRanksCurrentPage",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_rank"
              },
              {
                "kind": "arg",
                "type": {
                  "defined": "CreateInscriptionInput"
                },
                "path": "inscription_input.current_rank_page"
              }
            ]
          }
        },
        {
          "name": "inscriptionRanksNextPage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_data"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "root"
              }
            ]
          }
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "root"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "inscriptionInput",
          "type": {
            "defined": "CreateInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "deleteInscription",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "resizeInscription",
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
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_data"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Inscription",
                "path": "inscription.root"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "ResizeInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "writeToInscription",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "WriteToInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "setValidationHash",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
      "name": "inscriptionRankPage",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "size",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "inscriptionSummary",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inscriptionCountTotal",
            "type": "u64"
          },
          {
            "name": "inscriptionCountImmutables",
            "type": "u64"
          },
          {
            "name": "lastInscription",
            "type": "publicKey"
          },
          {
            "name": "lastInscriber",
            "type": "publicKey"
          },
          {
            "name": "lastInscriptionCreateTime",
            "type": "i64"
          },
          {
            "name": "extension",
            "type": {
              "defined": "SummaryExtension"
            }
          }
        ]
      }
    },
    {
      "name": "inscriptionData",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "inscription",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "root",
            "type": "publicKey"
          },
          {
            "name": "mediaType",
            "type": {
              "defined": "MediaType"
            }
          },
          {
            "name": "encodingType",
            "type": {
              "defined": "EncodingType"
            }
          },
          {
            "name": "inscriptionData",
            "type": "publicKey"
          },
          {
            "name": "order",
            "type": "u64"
          },
          {
            "name": "size",
            "type": "u32"
          },
          {
            "name": "validationHash",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CreateInscriptionRankInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pageIndex",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "CreateInscriptionInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "currentRankPage",
            "type": "u32"
          },
          {
            "name": "signerType",
            "type": {
              "defined": "SignerType"
            }
          },
          {
            "name": "mediaType",
            "type": {
              "defined": "MediaType"
            }
          },
          {
            "name": "encodingType",
            "type": {
              "defined": "EncodingType"
            }
          },
          {
            "name": "validationHash",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    },
    {
      "name": "ResizeInscriptionInput",
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
      "name": "WriteToInscriptionInput",
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
      "name": "SignerType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Root"
          },
          {
            "name": "LegacyMetadataSigner"
          }
        ]
      }
    },
    {
      "name": "SummaryExtension",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          }
        ]
      }
    },
    {
      "name": "MediaType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Image"
          },
          {
            "name": "Erc721"
          }
        ]
      }
    },
    {
      "name": "EncodingType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Base64"
          }
        ]
      }
    },
    {
      "name": "InscriptionEventType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Create"
          },
          {
            "name": "Update"
          },
          {
            "name": "Resize"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "InscriptionEventDelete",
      "fields": [
        {
          "name": "id",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "InscriptionResizeEvent",
      "fields": [
        {
          "name": "id",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "size",
          "type": "u32",
          "index": false
        }
      ]
    },
    {
      "name": "InscriptionResizeFinal",
      "fields": [
        {
          "name": "id",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "size",
          "type": "u32",
          "index": false
        }
      ]
    },
    {
      "name": "InscriptionWriteEvent",
      "fields": [
        {
          "name": "id",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "InscriptionEvent",
      "fields": [
        {
          "name": "id",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "eventType",
          "type": {
            "defined": "InscriptionEventType"
          },
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "BadAuthority",
      "msg": "Bad authority"
    },
    {
      "code": 6001,
      "name": "MaxSizeExceeded",
      "msg": "Max size exceeded"
    },
    {
      "code": 6002,
      "name": "BadInscriptionRankPage",
      "msg": "Bad page"
    },
    {
      "code": 6003,
      "name": "IncorrectInscriptionDataAccount",
      "msg": "Incorrect inscription data account"
    },
    {
      "code": 6004,
      "name": "RootSignerMismatch",
      "msg": "Root signer mismatch"
    },
    {
      "code": 6005,
      "name": "LegacyMetadataSignerMismatch",
      "msg": "Legacy metadata signer key does not match the expected PDA"
    }
  ]
};

export const IDL: LibreplexInscriptions = {
  "version": "0.2.2",
  "name": "libreplex_inscriptions",
  "instructions": [
    {
      "name": "createInscriptionRankPage",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "page",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_rank"
              },
              {
                "kind": "arg",
                "type": {
                  "defined": "CreateInscriptionRankInput"
                },
                "path": "input.page_index"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "CreateInscriptionRankInput"
          }
        }
      ]
    },
    {
      "name": "makeInscriptionImmutable",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_summary"
              }
            ]
          }
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createInscription",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "root",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_summary"
              }
            ]
          }
        },
        {
          "name": "inscriptionRanksCurrentPage",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_rank"
              },
              {
                "kind": "arg",
                "type": {
                  "defined": "CreateInscriptionInput"
                },
                "path": "inscription_input.current_rank_page"
              }
            ]
          }
        },
        {
          "name": "inscriptionRanksNextPage",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_data"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "root"
              }
            ]
          }
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "root"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "inscriptionInput",
          "type": {
            "defined": "CreateInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "deleteInscription",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "resizeInscription",
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
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "inscription_data"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Inscription",
                "path": "inscription.root"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "ResizeInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "writeToInscription",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "input",
          "type": {
            "defined": "WriteToInscriptionInput"
          }
        }
      ]
    },
    {
      "name": "setValidationHash",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "inscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
      "name": "inscriptionRankPage",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "size",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "inscriptionSummary",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inscriptionCountTotal",
            "type": "u64"
          },
          {
            "name": "inscriptionCountImmutables",
            "type": "u64"
          },
          {
            "name": "lastInscription",
            "type": "publicKey"
          },
          {
            "name": "lastInscriber",
            "type": "publicKey"
          },
          {
            "name": "lastInscriptionCreateTime",
            "type": "i64"
          },
          {
            "name": "extension",
            "type": {
              "defined": "SummaryExtension"
            }
          }
        ]
      }
    },
    {
      "name": "inscriptionData",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "inscription",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "root",
            "type": "publicKey"
          },
          {
            "name": "mediaType",
            "type": {
              "defined": "MediaType"
            }
          },
          {
            "name": "encodingType",
            "type": {
              "defined": "EncodingType"
            }
          },
          {
            "name": "inscriptionData",
            "type": "publicKey"
          },
          {
            "name": "order",
            "type": "u64"
          },
          {
            "name": "size",
            "type": "u32"
          },
          {
            "name": "validationHash",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CreateInscriptionRankInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pageIndex",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "CreateInscriptionInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "currentRankPage",
            "type": "u32"
          },
          {
            "name": "signerType",
            "type": {
              "defined": "SignerType"
            }
          },
          {
            "name": "mediaType",
            "type": {
              "defined": "MediaType"
            }
          },
          {
            "name": "encodingType",
            "type": {
              "defined": "EncodingType"
            }
          },
          {
            "name": "validationHash",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    },
    {
      "name": "ResizeInscriptionInput",
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
      "name": "WriteToInscriptionInput",
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
      "name": "SignerType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Root"
          },
          {
            "name": "LegacyMetadataSigner"
          }
        ]
      }
    },
    {
      "name": "SummaryExtension",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          }
        ]
      }
    },
    {
      "name": "MediaType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Image"
          },
          {
            "name": "Erc721"
          }
        ]
      }
    },
    {
      "name": "EncodingType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Base64"
          }
        ]
      }
    },
    {
      "name": "InscriptionEventType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Create"
          },
          {
            "name": "Update"
          },
          {
            "name": "Resize"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "InscriptionEventDelete",
      "fields": [
        {
          "name": "id",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "InscriptionResizeEvent",
      "fields": [
        {
          "name": "id",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "size",
          "type": "u32",
          "index": false
        }
      ]
    },
    {
      "name": "InscriptionResizeFinal",
      "fields": [
        {
          "name": "id",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "size",
          "type": "u32",
          "index": false
        }
      ]
    },
    {
      "name": "InscriptionWriteEvent",
      "fields": [
        {
          "name": "id",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "InscriptionEvent",
      "fields": [
        {
          "name": "id",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "eventType",
          "type": {
            "defined": "InscriptionEventType"
          },
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "BadAuthority",
      "msg": "Bad authority"
    },
    {
      "code": 6001,
      "name": "MaxSizeExceeded",
      "msg": "Max size exceeded"
    },
    {
      "code": 6002,
      "name": "BadInscriptionRankPage",
      "msg": "Bad page"
    },
    {
      "code": 6003,
      "name": "IncorrectInscriptionDataAccount",
      "msg": "Incorrect inscription data account"
    },
    {
      "code": 6004,
      "name": "RootSignerMismatch",
      "msg": "Root signer mismatch"
    },
    {
      "code": 6005,
      "name": "LegacyMetadataSignerMismatch",
      "msg": "Legacy metadata signer key does not match the expected PDA"
    }
  ]
};
