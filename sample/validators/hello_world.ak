use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{Transaction, OutputReference}
use aiken/collection/list

// Alice is the address owner
// Each address has a pubkey hash = verification hash
// Datum is the pubkey hash
// Alice will lock funds into smart contract and attach datum
// Redeemer is a message

// Two conditions to unlock the funds:
// 1. Redeemer must be "Hello World"
// 2. Only Alice can unlock the funds, smart contract will check who is making the transaction,
// check signature of transaction = datum, it must be Alice's signature

pub type Datum {
  owner: VerificationKeyHash
}

pub type Redeemer {
  msg: ByteArray
}

validator hello_world {
  spend(datum: Option<Datum>, redeemer: Redeemer, _utxo: OutputReference, self: Transaction) {
    expect Some(Datum { owner }) = datum
    let must_say_hello = redeemer.msg == "Hello World"
    let must_be_signed = list.has(self.extra_signatories, owner)

    must_say_hello? && must_be_signed?
  }
}

// Test case 1
// Success
// right message, right owner

test success() {
  let datum = Datum { owner: #"0000000000000000000000000000000000000000000000000000000000000000"}

  let redeemer = Redeemer { msg: "Hello World" }

  let placeholder_utxo = OutputReference { transaction_id: "", output_index: 0 }

  hello_world.spend(
    Some(datum),
    redeemer,
    placeholder_utxo,
    Transaction { 
      ..transaction.placeholder,
      extra_signatories: [#"0000000000000000000000000000000000000000000000000000000000000000"]
    }
  )
}

// Test case 2
// Fail
// wrong message, right owner

test fail_wrong_message() fail {
  let datum = Datum { owner: #"0000000000000000000000000000000000000000000000000000000000000000"}

  let redeemer = Redeemer { msg: "Wrong message" }

  let placeholder_utxo = OutputReference { transaction_id: "", output_index: 0 }

  hello_world.spend(
    Some(datum),
    redeemer,
    placeholder_utxo,
    Transaction {
      ..transaction.placeholder,
      extra_signatories: [#"0000000000000000000000000000000000000000000000000000000000000000"]
    }
  )
}

// Test case 3
// Fail
// right message, wrong owner

test fail_wrong_owner() fail {
  let datum = Datum { owner: #"0000000000000000000000000000000000000000000000000000000000000000"}

  let redeemer = Redeemer { msg: "Hello World" }

  let placeholder_utxo = OutputReference { transaction_id: "", output_index: 0 }

  hello_world.spend(
    Some(datum),
    redeemer,
    placeholder_utxo,
    Transaction {
      ..transaction.placeholder,
      extra_signatories: [#"1111111111111111111111111111111111111111111111111111111111111111"]
    }
  )
}
