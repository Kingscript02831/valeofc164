
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return hasLowerCase && hasUpperCase && hasNumber;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !name || !username || !phone || !birthDate) {
      toast({
        title: "Erro ao criar conta",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Senha inválida",
        description: "A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula e um número",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            username,
            phone,
            birth_date: birthDate,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo ao sistema!",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111B21] p-6">
      <div className="w-full max-w-md bg-[#202C33]/90 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
          <p className="text-gray-400">Preencha todos os campos abaixo para se registrar</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5 mt-6">
          <InputField label="Nome Completo" id="name" type="text" value={name} setValue={setName} placeholder="Seu nome completo" />
          <InputField label="Nome de Usuário" id="username" type="text" value={username} setValue={setUsername} placeholder="@seu.usuario" />
          <InputField label="Email" id="email" type="email" value={email} setValue={setEmail} placeholder="seu@email.com" />
          <InputField label="Telefone" id="phone" type="tel" value={phone} setValue={setPhone} placeholder="(00) 00000-0000" />
          <InputField label="Data de Nascimento" id="birthDate" type="date" value={birthDate} setValue={setBirthDate} />
          <div>
            <InputField label="Senha" id="password" type="password" value={password} setValue={setPassword} placeholder="******" />
            <p className="mt-2 text-sm text-gray-400">
              A senha deve conter pelo menos:
              <ul className="list-disc list-inside mt-1">
                <li>Uma letra minúscula</li>
                <li>Uma letra maiúscula</li>
                <li>Um número</li>
              </ul>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-green-500 hover:bg-green-400 text-white font-medium rounded-lg transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>

          <p className="text-center text-sm text-gray-400">
            Já possui uma conta?{" "}
            <Button
              variant="link"
              className="p-0 text-green-400 hover:text-green-300 transition"
              onClick={() => navigate("/login")}
            >
              Fazer login
            </Button>
          </p>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, id, type, value, setValue, placeholder = "" }) => (
  <div>
    <label htmlFor={id} className="text-sm font-medium text-gray-300">
      {label}
    </label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required
      className="bg-[#2A3942] border-[#37454F] text-white placeholder-gray-400"
    />
  </div>
);

export default SignUp;
