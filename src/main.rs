fn main() {
    println!("Hello, world!");

    // Print all arugments when aruments passed to the program
    if std::env::args().len() > 1 {
        println!("aruments:");
        for arg in std::env::args() {
            println!("{}", arg);
        }
    }
}