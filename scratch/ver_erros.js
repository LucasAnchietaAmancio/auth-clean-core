import UserEntity from "../src/domain/UserEntity.js";

const dataValid = {
    name: "João Silva",
    email: "lucas@gmail.com",
    password: "LucasAnchieta@2025"
};

const testCases = [
    { label: "ERRO DE E-MAIL (Formato)", data: { ...dataValid, email: "lucas.gmail.com" } },
    { label: "ERRO DE NOME (Curto)", data: { ...dataValid, name: "Jo" } },
    { label: "ERRO DE SENHA (Fraca)", data: { ...dataValid, password: "123" } }
];

console.log("=== DEMONSTRAÇÃO DE ERROS DE DOMÍNIO ===\n");

testCases.forEach(testCase => {
    try {
        console.log(`>>> Testando: ${testCase.label}`);
        new UserEntity(testCase.data);
    } catch (error) {
        // Exibindo as propriedades customizadas do erro
        console.log({
            message: error.message,
            description: error.description,
            code: error.code,
            type: error.type,
            details: error.details
        });
        console.log("\n" + "-".repeat(40) + "\n");
    }
});
