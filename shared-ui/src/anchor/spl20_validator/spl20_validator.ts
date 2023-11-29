export type Spl20Validator = {
  "version": "0.2.2",
  "name": "spl20_validator",
  "instructions": [
    {
      "name": "validate",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "validator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validationResult",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validations",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasury",
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
      "name": "createValidator",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "validator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validations",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validatorIndex",
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
            "defined": "CreateValidatorInput"
          }
        }
      ]
    },
    {
      "name": "editValidator",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "validator",
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
            "defined": "EditValidatorInput"
          }
        }
      ]
    },
    {
      "name": "createValidatorIndex",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "validatorIndex",
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
      "name": "depositAndSwapSols",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAccountOut",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintOut",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "metadataOut",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEditionOut",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionOut",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionV3Out",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionDataOut",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solsEscrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solsPrintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "splTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
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
          "name": "validationConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solsPrinter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validationResult",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "validations",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintIn",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "incoming parameters"
          ]
        },
        {
          "name": "metadataIn",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionIn",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccountIn",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountSolsEscrow",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
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
      "name": "inscriptionV3",
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
            "name": "contentType",
            "type": "string"
          },
          {
            "name": "encoding",
            "type": "string"
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
      "name": "solsPrinter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "printCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "validationConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "orderCutoffMin",
            "type": "u32"
          },
          {
            "name": "orderCutoffMax",
            "type": "u32"
          },
          {
            "name": "validationCount",
            "type": "u32"
          },
          {
            "name": "inscriptionAscii",
            "type": "string"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "status",
            "type": {
              "defined": "ValidationConfigStatus"
            }
          }
        ]
      }
    },
    {
      "name": "validationResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validator",
            "type": "publicKey"
          },
          {
            "name": "validationOrder",
            "type": "u32"
          },
          {
            "name": "validatedMint",
            "type": "publicKey"
          },
          {
            "name": "validatedBy",
            "type": "publicKey"
          },
          {
            "name": "invalidatedBy",
            "type": "publicKey"
          },
          {
            "name": "validationStatus",
            "type": {
              "defined": "ValidationStatus"
            }
          }
        ]
      }
    },
    {
      "name": "validations",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validationConfig",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "validator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "orderCutoffMin",
            "type": "u32"
          },
          {
            "name": "orderCutoffMax",
            "type": "u32"
          },
          {
            "name": "validationCountCurrent",
            "type": "u32"
          },
          {
            "name": "validationCountMax",
            "type": "u32"
          },
          {
            "name": "imageUrl",
            "docs": [
              "10 strings"
            ],
            "type": "string"
          },
          {
            "name": "jsonUrl",
            "type": "string"
          },
          {
            "name": "nftName",
            "type": "string"
          },
          {
            "name": "nftSymbol",
            "type": "string"
          },
          {
            "name": "ticker",
            "type": "string"
          },
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "status",
            "docs": [
              "after status goes live, the config becomes immutable. this is to avoid"
            ],
            "type": {
              "defined": "LauncherStatus"
            }
          }
        ]
      }
    },
    {
      "name": "validatorIndex",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validators",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "EncodingType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Base64"
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
            "name": "None"
          },
          {
            "name": "Audio",
            "fields": [
              {
                "name": "subtype",
                "type": "string"
              }
            ]
          },
          {
            "name": "Application",
            "fields": [
              {
                "name": "subtype",
                "type": "string"
              }
            ]
          },
          {
            "name": "Image",
            "fields": [
              {
                "name": "subtype",
                "type": "string"
              }
            ]
          },
          {
            "name": "Video",
            "fields": [
              {
                "name": "subtype",
                "type": "string"
              }
            ]
          },
          {
            "name": "Text",
            "fields": [
              {
                "name": "subtype",
                "type": "string"
              }
            ]
          },
          {
            "name": "Custom",
            "fields": [
              {
                "name": "mediaType",
                "type": "string"
              }
            ]
          },
          {
            "name": "Erc721"
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
      "name": "CreateValidatorInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderCutoffMin",
            "type": "u32"
          },
          {
            "name": "orderCutoffMax",
            "type": "u32"
          },
          {
            "name": "maxValidations",
            "type": "u32"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "jsonUrl",
            "type": "string"
          },
          {
            "name": "nftName",
            "type": "string"
          },
          {
            "name": "nftSymbol",
            "type": "string"
          },
          {
            "name": "ticker",
            "type": "string"
          },
          {
            "name": "hashlistSize",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "EditValidatorInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validationCountMax",
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "orderCutoffMax",
            "type": {
              "option": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "ValidationConfigStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Inactive"
          },
          {
            "name": "Otc"
          }
        ]
      }
    },
    {
      "name": "ValidationStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Invalid"
          },
          {
            "name": "Valid"
          },
          {
            "name": "ManualInvalidation"
          },
          {
            "name": "CustomValidation"
          }
        ]
      }
    },
    {
      "name": "LauncherStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Inactive"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NumericalOverflow",
      "msg": "Numeric overflow"
    },
    {
      "code": 6001,
      "name": "DerivedKeyInvalid",
      "msg": "Derived key invalid"
    },
    {
      "code": 6002,
      "name": "MissingBump",
      "msg": "Missing bump"
    },
    {
      "code": 6003,
      "name": "InvalidBump",
      "msg": "Invalid bump"
    },
    {
      "code": 6004,
      "name": "MissingMasterEditionForNft",
      "msg": "Missing master edition for NFT"
    },
    {
      "code": 6005,
      "name": "TokenAccountNotEmpty",
      "msg": "Token account not empty"
    },
    {
      "code": 6006,
      "name": "MissingTokenAccount",
      "msg": "Missing token account"
    },
    {
      "code": 6007,
      "name": "MissingDestinationAccount",
      "msg": "Missing destination account"
    },
    {
      "code": 6008,
      "name": "BadTreasury",
      "msg": "Bad treasury"
    },
    {
      "code": 6009,
      "name": "BadOwner",
      "msg": "Bad owner"
    },
    {
      "code": 6010,
      "name": "BadMint",
      "msg": "Bad mint"
    },
    {
      "code": 6011,
      "name": "BadTokenAccountMint",
      "msg": "Bad mint on token account"
    },
    {
      "code": 6012,
      "name": "BadTokenAccountOwner",
      "msg": "Bad owner of token account"
    },
    {
      "code": 6013,
      "name": "BadTokenAccount",
      "msg": "Bad token account"
    },
    {
      "code": 6014,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6015,
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6016,
      "name": "InstructionBuildError",
      "msg": "Instruction build error"
    },
    {
      "code": 6017,
      "name": "UnexpectedTokenType",
      "msg": "Unexpected token type"
    },
    {
      "code": 6018,
      "name": "CannotTransferMultiplePnfts",
      "msg": "When transferring a pNFT, the amount must be 1"
    },
    {
      "code": 6019,
      "name": "NativeSolAuthSeedsNotSpecified",
      "msg": "Must transfer auth seeds for native sol"
    },
    {
      "code": 6020,
      "name": "MissingTokenRecord",
      "msg": "Missing token record"
    },
    {
      "code": 6021,
      "name": "InstructionBuilderFailed",
      "msg": "Instruction builder failed"
    },
    {
      "code": 6022,
      "name": "MissingInstructionsSysvar",
      "msg": "Missing instruction sysvar"
    }
  ]
};

export const IDL: Spl20Validator = {
  "version": "0.2.2",
  "name": "spl20_validator",
  "instructions": [
    {
      "name": "validate",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "validator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validationResult",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validations",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscription",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionData",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasury",
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
      "name": "createValidator",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "validator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validations",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validatorIndex",
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
            "defined": "CreateValidatorInput"
          }
        }
      ]
    },
    {
      "name": "editValidator",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "validator",
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
            "defined": "EditValidatorInput"
          }
        }
      ]
    },
    {
      "name": "createValidatorIndex",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "validatorIndex",
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
      "name": "depositAndSwapSols",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAccountOut",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintOut",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "metadataOut",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEditionOut",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionOut",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionV3Out",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionDataOut",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solsEscrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solsPrintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "splTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
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
          "name": "validationConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solsPrinter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validationResult",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inscriptionSummary",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "validations",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintIn",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "incoming parameters"
          ]
        },
        {
          "name": "metadataIn",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inscriptionIn",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccountIn",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountSolsEscrow",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
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
      "name": "inscriptionV3",
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
            "name": "contentType",
            "type": "string"
          },
          {
            "name": "encoding",
            "type": "string"
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
      "name": "solsPrinter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "printCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "validationConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "orderCutoffMin",
            "type": "u32"
          },
          {
            "name": "orderCutoffMax",
            "type": "u32"
          },
          {
            "name": "validationCount",
            "type": "u32"
          },
          {
            "name": "inscriptionAscii",
            "type": "string"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "status",
            "type": {
              "defined": "ValidationConfigStatus"
            }
          }
        ]
      }
    },
    {
      "name": "validationResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validator",
            "type": "publicKey"
          },
          {
            "name": "validationOrder",
            "type": "u32"
          },
          {
            "name": "validatedMint",
            "type": "publicKey"
          },
          {
            "name": "validatedBy",
            "type": "publicKey"
          },
          {
            "name": "invalidatedBy",
            "type": "publicKey"
          },
          {
            "name": "validationStatus",
            "type": {
              "defined": "ValidationStatus"
            }
          }
        ]
      }
    },
    {
      "name": "validations",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validationConfig",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "validator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "orderCutoffMin",
            "type": "u32"
          },
          {
            "name": "orderCutoffMax",
            "type": "u32"
          },
          {
            "name": "validationCountCurrent",
            "type": "u32"
          },
          {
            "name": "validationCountMax",
            "type": "u32"
          },
          {
            "name": "imageUrl",
            "docs": [
              "10 strings"
            ],
            "type": "string"
          },
          {
            "name": "jsonUrl",
            "type": "string"
          },
          {
            "name": "nftName",
            "type": "string"
          },
          {
            "name": "nftSymbol",
            "type": "string"
          },
          {
            "name": "ticker",
            "type": "string"
          },
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "status",
            "docs": [
              "after status goes live, the config becomes immutable. this is to avoid"
            ],
            "type": {
              "defined": "LauncherStatus"
            }
          }
        ]
      }
    },
    {
      "name": "validatorIndex",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validators",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "EncodingType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Base64"
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
            "name": "None"
          },
          {
            "name": "Audio",
            "fields": [
              {
                "name": "subtype",
                "type": "string"
              }
            ]
          },
          {
            "name": "Application",
            "fields": [
              {
                "name": "subtype",
                "type": "string"
              }
            ]
          },
          {
            "name": "Image",
            "fields": [
              {
                "name": "subtype",
                "type": "string"
              }
            ]
          },
          {
            "name": "Video",
            "fields": [
              {
                "name": "subtype",
                "type": "string"
              }
            ]
          },
          {
            "name": "Text",
            "fields": [
              {
                "name": "subtype",
                "type": "string"
              }
            ]
          },
          {
            "name": "Custom",
            "fields": [
              {
                "name": "mediaType",
                "type": "string"
              }
            ]
          },
          {
            "name": "Erc721"
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
      "name": "CreateValidatorInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderCutoffMin",
            "type": "u32"
          },
          {
            "name": "orderCutoffMax",
            "type": "u32"
          },
          {
            "name": "maxValidations",
            "type": "u32"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "jsonUrl",
            "type": "string"
          },
          {
            "name": "nftName",
            "type": "string"
          },
          {
            "name": "nftSymbol",
            "type": "string"
          },
          {
            "name": "ticker",
            "type": "string"
          },
          {
            "name": "hashlistSize",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "EditValidatorInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validationCountMax",
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "orderCutoffMax",
            "type": {
              "option": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "ValidationConfigStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Inactive"
          },
          {
            "name": "Otc"
          }
        ]
      }
    },
    {
      "name": "ValidationStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Invalid"
          },
          {
            "name": "Valid"
          },
          {
            "name": "ManualInvalidation"
          },
          {
            "name": "CustomValidation"
          }
        ]
      }
    },
    {
      "name": "LauncherStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Inactive"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NumericalOverflow",
      "msg": "Numeric overflow"
    },
    {
      "code": 6001,
      "name": "DerivedKeyInvalid",
      "msg": "Derived key invalid"
    },
    {
      "code": 6002,
      "name": "MissingBump",
      "msg": "Missing bump"
    },
    {
      "code": 6003,
      "name": "InvalidBump",
      "msg": "Invalid bump"
    },
    {
      "code": 6004,
      "name": "MissingMasterEditionForNft",
      "msg": "Missing master edition for NFT"
    },
    {
      "code": 6005,
      "name": "TokenAccountNotEmpty",
      "msg": "Token account not empty"
    },
    {
      "code": 6006,
      "name": "MissingTokenAccount",
      "msg": "Missing token account"
    },
    {
      "code": 6007,
      "name": "MissingDestinationAccount",
      "msg": "Missing destination account"
    },
    {
      "code": 6008,
      "name": "BadTreasury",
      "msg": "Bad treasury"
    },
    {
      "code": 6009,
      "name": "BadOwner",
      "msg": "Bad owner"
    },
    {
      "code": 6010,
      "name": "BadMint",
      "msg": "Bad mint"
    },
    {
      "code": 6011,
      "name": "BadTokenAccountMint",
      "msg": "Bad mint on token account"
    },
    {
      "code": 6012,
      "name": "BadTokenAccountOwner",
      "msg": "Bad owner of token account"
    },
    {
      "code": 6013,
      "name": "BadTokenAccount",
      "msg": "Bad token account"
    },
    {
      "code": 6014,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6015,
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6016,
      "name": "InstructionBuildError",
      "msg": "Instruction build error"
    },
    {
      "code": 6017,
      "name": "UnexpectedTokenType",
      "msg": "Unexpected token type"
    },
    {
      "code": 6018,
      "name": "CannotTransferMultiplePnfts",
      "msg": "When transferring a pNFT, the amount must be 1"
    },
    {
      "code": 6019,
      "name": "NativeSolAuthSeedsNotSpecified",
      "msg": "Must transfer auth seeds for native sol"
    },
    {
      "code": 6020,
      "name": "MissingTokenRecord",
      "msg": "Missing token record"
    },
    {
      "code": 6021,
      "name": "InstructionBuilderFailed",
      "msg": "Instruction builder failed"
    },
    {
      "code": 6022,
      "name": "MissingInstructionsSysvar",
      "msg": "Missing instruction sysvar"
    }
  ]
};
