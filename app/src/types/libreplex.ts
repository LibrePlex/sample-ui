export type Libreplex = {
  "version": "0.1.0",
  "name": "libreplex",
  "instructions": [
    {
      "name": "createCollection",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPermissions",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "permissions"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Collection",
                "path": "collection"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "collection"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "seed"
              }
            ]
          }
        },
        {
          "name": "seed",
          "isMut": false,
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
          "name": "collectionInput",
          "type": {
            "defined": "CollectionInput"
          }
        }
      ]
    },
    {
      "name": "deleteCollection",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "signerCollectionPermissions",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "permissions"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Collection",
                "path": "collection"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiver",
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
      "name": "createMetadata",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signerCollectionPermissions",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "permissions"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Collection",
                "path": "collection"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "metadataInput",
          "type": {
            "defined": "MetadataInput"
          }
        }
      ]
    },
    {
      "name": "deleteMetadata",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userPermissions",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "permissions"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Collection",
                "path": "collection"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "mint"
              }
            ]
          },
          "relations": [
            "collection",
            "mint"
          ]
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receiver",
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
    }
  ],
  "accounts": [
    {
      "name": "collection",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seed",
            "type": "publicKey"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "itemCount",
            "type": "u64"
          },
          {
            "name": "nftCollectionData",
            "type": {
              "option": {
                "defined": "NftCollectionData"
              }
            }
          }
        ]
      }
    },
    {
      "name": "metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collection",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "isMutable",
            "type": "bool"
          },
          {
            "name": "nftData",
            "type": {
              "option": {
                "defined": "NftMetadata"
              }
            }
          }
        ]
      }
    },
    {
      "name": "nftMetadataUnique",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "metadata",
            "type": "publicKey"
          },
          {
            "name": "royaltyBpsOverride",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "royaltiesShareOverride",
            "type": {
              "option": {
                "vec": {
                  "defined": "RoyaltyShare"
                }
              }
            }
          },
          {
            "name": "permittedSignersOverride",
            "type": {
              "option": {
                "vec": "publicKey"
              }
            }
          }
        ]
      }
    },
    {
      "name": "metadataPermissions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "metadata",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "canModify",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "collectionPermissions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collection",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "isAdmin",
            "type": "bool"
          },
          {
            "name": "canCreateMetadata",
            "type": "bool"
          },
          {
            "name": "canEditMetadata",
            "type": "bool"
          },
          {
            "name": "canDeleteMetadata",
            "type": "bool"
          },
          {
            "name": "canEditCollection",
            "type": "bool"
          },
          {
            "name": "canDeleteCollection",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "NftCollectionData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "royaltyBps",
            "type": "u16"
          },
          {
            "name": "royaltyShares",
            "type": {
              "vec": {
                "defined": "RoyaltyShare"
              }
            }
          },
          {
            "name": "permittedSigners",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "RoyaltyShare",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "type": "publicKey"
          },
          {
            "name": "share",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "CollectionInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "collectionUrl",
            "type": "string"
          },
          {
            "name": "nftCollectionData",
            "type": {
              "option": {
                "defined": "NftCollectionData"
              }
            }
          }
        ]
      }
    },
    {
      "name": "NftMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "attributes",
            "type": {
              "vec": {
                "defined": "Attribute"
              }
            }
          },
          {
            "name": "signers",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "Attribute",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "traitType",
            "type": "string"
          },
          {
            "name": "attribute",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "MetadataInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "metadataUrl",
            "type": "string"
          },
          {
            "name": "nftMetadata",
            "type": {
              "option": {
                "defined": "NftMetadata"
              }
            }
          }
        ]
      }
    }
  ]
};

export const IDL: Libreplex = {
  "version": "0.1.0",
  "name": "libreplex",
  "instructions": [
    {
      "name": "createCollection",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPermissions",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "permissions"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Collection",
                "path": "collection"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "collection"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "seed"
              }
            ]
          }
        },
        {
          "name": "seed",
          "isMut": false,
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
          "name": "collectionInput",
          "type": {
            "defined": "CollectionInput"
          }
        }
      ]
    },
    {
      "name": "deleteCollection",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "signerCollectionPermissions",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "permissions"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Collection",
                "path": "collection"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiver",
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
      "name": "createMetadata",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signerCollectionPermissions",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "permissions"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Collection",
                "path": "collection"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "metadataInput",
          "type": {
            "defined": "MetadataInput"
          }
        }
      ]
    },
    {
      "name": "deleteMetadata",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userPermissions",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "permissions"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Collection",
                "path": "collection"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "mint"
              }
            ]
          },
          "relations": [
            "collection",
            "mint"
          ]
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receiver",
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
    }
  ],
  "accounts": [
    {
      "name": "collection",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seed",
            "type": "publicKey"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "itemCount",
            "type": "u64"
          },
          {
            "name": "nftCollectionData",
            "type": {
              "option": {
                "defined": "NftCollectionData"
              }
            }
          }
        ]
      }
    },
    {
      "name": "metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collection",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "isMutable",
            "type": "bool"
          },
          {
            "name": "nftData",
            "type": {
              "option": {
                "defined": "NftMetadata"
              }
            }
          }
        ]
      }
    },
    {
      "name": "nftMetadataUnique",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "metadata",
            "type": "publicKey"
          },
          {
            "name": "royaltyBpsOverride",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "royaltiesShareOverride",
            "type": {
              "option": {
                "vec": {
                  "defined": "RoyaltyShare"
                }
              }
            }
          },
          {
            "name": "permittedSignersOverride",
            "type": {
              "option": {
                "vec": "publicKey"
              }
            }
          }
        ]
      }
    },
    {
      "name": "metadataPermissions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "metadata",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "canModify",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "collectionPermissions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collection",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "isAdmin",
            "type": "bool"
          },
          {
            "name": "canCreateMetadata",
            "type": "bool"
          },
          {
            "name": "canEditMetadata",
            "type": "bool"
          },
          {
            "name": "canDeleteMetadata",
            "type": "bool"
          },
          {
            "name": "canEditCollection",
            "type": "bool"
          },
          {
            "name": "canDeleteCollection",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "NftCollectionData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "royaltyBps",
            "type": "u16"
          },
          {
            "name": "royaltyShares",
            "type": {
              "vec": {
                "defined": "RoyaltyShare"
              }
            }
          },
          {
            "name": "permittedSigners",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "RoyaltyShare",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "type": "publicKey"
          },
          {
            "name": "share",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "CollectionInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "collectionUrl",
            "type": "string"
          },
          {
            "name": "nftCollectionData",
            "type": {
              "option": {
                "defined": "NftCollectionData"
              }
            }
          }
        ]
      }
    },
    {
      "name": "NftMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "attributes",
            "type": {
              "vec": {
                "defined": "Attribute"
              }
            }
          },
          {
            "name": "signers",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "Attribute",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "traitType",
            "type": "string"
          },
          {
            "name": "attribute",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "MetadataInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "metadataUrl",
            "type": "string"
          },
          {
            "name": "nftMetadata",
            "type": {
              "option": {
                "defined": "NftMetadata"
              }
            }
          }
        ]
      }
    }
  ]
};
