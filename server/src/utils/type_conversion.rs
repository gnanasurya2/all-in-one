pub fn i8_to_bool(int: Option<i8>) -> bool {
    if int.is_some_and(|x| x == 1) {
        true
    } else {
        false
    }
}
