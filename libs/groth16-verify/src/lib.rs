use std::ffi::CStr;
use std::os::raw::c_char;
use std::str::FromStr;
use ark_snark::SNARK;

type GrothBn = ark_groth16::Groth16<ark_bn254::Bn254, ark_circom::CircomReduction>;

#[no_mangle]
pub extern "C" fn groth16_verify(inputs: *const c_char,
                          proof: *const c_char,
                          verification_key: *const c_char) -> bool {
    let inputs = unsafe {
        assert!(!inputs.is_null());
        CStr::from_ptr(inputs)
    };

    let proof = unsafe {
        assert!(!proof.is_null());
        CStr::from_ptr(proof)
    };

    let verification_key = unsafe {
        assert!(!verification_key.is_null());
        CStr::from_ptr(verification_key)
    };

    verify(inputs.to_str().unwrap(), proof.to_str().unwrap(), verification_key.to_str().unwrap())
}

pub fn verify(public_inputs: &str, proof: &str, verification_key: &str) -> bool {
    let vk = unmarshal_verification_key(verification_key);
    let pvk = GrothBn::process_vk(&vk).unwrap();
    let inputs = json_to_ints(public_inputs);
    let proof = unmarshal_proof(proof);
    let verified = GrothBn::verify_with_processed_vk(&pvk, inputs.as_slice(), &proof).unwrap();
    verified
}

fn unmarshal_verification_key(vk_json: &str) -> ark_groth16::VerifyingKey<ark_bn254::Bn254> {
    let json: serde_json::Value = serde_json::from_str(vk_json).unwrap();
    ark_groth16::VerifyingKey::<ark_bn254::Bn254> {
        alpha_g1: json_to_g1(&json, "vk_alpha_1"),
        beta_g2: json_to_g2(&json, "vk_beta_2"),
        gamma_g2: json_to_g2(&json, "vk_gamma_2"),
        delta_g2: json_to_g2(&json, "vk_delta_2"),
        gamma_abc_g1: json_to_g1_vec(&json, "IC"),
    }
}

fn json_to_g1(json: &serde_json::Value, key: &str) -> ark_bn254::G1Affine {
    let els: Vec<String> = json
        .get(key)
        .unwrap()
        .as_array()
        .unwrap()
        .iter()
        .map(|i| i.as_str().unwrap().to_string())
        .collect();
    ark_bn254::G1Affine::from(ark_bn254::G1Projective::new(
        fq_from_str(&els[0]),
        fq_from_str(&els[1]),
        fq_from_str(&els[2]),
    ))
}

fn json_to_g2(json: &serde_json::Value, key: &str) -> ark_bn254::G2Affine {
    let els: Vec<Vec<String>> = json
        .get(key)
        .unwrap()
        .as_array()
        .unwrap()
        .iter()
        .map(|i| {
            i.as_array()
                .unwrap()
                .iter()
                .map(|x| x.as_str().unwrap().to_string())
                .collect::<Vec<String>>()
        })
        .collect();

    let x = ark_bn254::Fq2::new(fq_from_str(&els[0][0]), fq_from_str(&els[0][1]));
    let y = ark_bn254::Fq2::new(fq_from_str(&els[1][0]), fq_from_str(&els[1][1]));
    let z = ark_bn254::Fq2::new(fq_from_str(&els[2][0]), fq_from_str(&els[2][1]));
    ark_bn254::G2Affine::from(ark_bn254::G2Projective::new(x, y, z))
}

fn json_to_g1_vec(json: &serde_json::Value, key: &str) -> Vec<ark_bn254::G1Affine> {
    let els: Vec<Vec<String>> = json
        .get(key)
        .unwrap()
        .as_array()
        .unwrap()
        .iter()
        .map(|i| {
            i.as_array()
                .unwrap()
                .iter()
                .map(|x| x.as_str().unwrap().to_string())
                .collect::<Vec<String>>()
        })
        .collect();

    els.iter()
        .map(|coords| {
            ark_bn254::G1Affine::from(ark_bn254::G1Projective::new(
                fq_from_str(&coords[0]),
                fq_from_str(&coords[1]),
                fq_from_str(&coords[2]),
            ))
        })
        .collect()
}

fn fq_from_str(v: &str) -> ark_bn254::Fq {
    ark_bn254::Fq::from_str(v).unwrap()
}

fn json_to_ints(input: &str) -> Vec<ark_bn254::fr::Fr> {
    let string_vec: Vec<String> = serde_json::from_str(input).unwrap();

    return string_vec.into_iter()
        .map(|s| ark_bn254::fr::Fr::from_str(s.as_str()).unwrap())
        .collect();
}

fn unmarshal_proof(proof_json: &str) -> ark_groth16::Proof<ark_bn254::Bn254> {
    let json: serde_json::Value = serde_json::from_str(&proof_json).unwrap();
    ark_groth16::Proof::<ark_bn254::Bn254> {
        a: json_to_g1(&json, "pi_a"),
        b: json_to_g2(&json, "pi_b"),
        c: json_to_g1(&json, "pi_c"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let verification_key = include_str!("../test-vectors/simple-circuit/verification_key.json");
        let public_inputs = include_str!("../test-vectors/simple-circuit/public.json");
        let proof = include_str!("../test-vectors/simple-circuit/proof.json");
        assert!(verify(public_inputs, proof, verification_key));
    }
}
