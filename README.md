# Scan - Solução de mapeamento de planta

## Para conectar no GitLab via SSH no VS Code

> Nos exemplos abaixo, `~` equivale ao diretório de usuário, normalmente `C:\Users\MATRICULA`.

1. Instale o [Git para Windows](https://git-scm.com/download/win).
2. Crie uma conta no [GitLab](https://gitlab.intranet.bb.com.br).
3. Crie um par de chaves:

        ssh-keygen -t rsa -C "seu.email@exemplo.com" -b 4096

4. Adicione a chave pública ao seu [perfil no GitLab](https://gitlab.intranet.bb.com.br/profile/keys).
5. Crie o arquivo `~/.ssh/config`, caso ainda não exista, e adicione o seguinte conteúdo:

        # GitLab BB
        Host gitlab.intranet.bb.com.br
        User CHAVE_SISBB
        PubkeyAuthentication yes
        IdentityFile ~/.ssh/id_rsa

6. Crie o arquivo `~/.profile`, caso ainda não exista, e adicione o seguinte conteúdo:

        env=~/.ssh/agent.env

        agent_load_env () { test -f "$env" && . "$env" >| /dev/null ; }

        agent_start () {
            (umask 077; ssh-agent >| "$env")
            . "$env" >| /dev/null ; }

        agent_load_env

        # agent_run_state: 0=agent running w/ key; 1=agent w/o key; 2= agent not running
        agent_run_state=$(ssh-add -l >| /dev/null 2>&1; echo $?)

        if [ ! "$SSH_AUTH_SOCK" ] || [ $agent_run_state = 2 ]; then
            agent_start
            ssh-add
        elif [ "$SSH_AUTH_SOCK" ] && [ $agent_run_state = 1 ]; then
            ssh-add
        fi

        unset env

7. (Re)Abra o Git Bash e execute o comando `code`. O Git Bash pode ser fechado em seguida.
8. **OPCIONAL:** Para abrir o VS Code e fechar o Git Bash num único comando (`Code`, por exemplo),
   adicione esta linha ao arquivo `~/.profile`:

        alias Code='(code &) && exit'
        
# Scan Front Deploy

## Gerando BUILD do Projeto

- Clone o projeto *scan-angular* pelo link *ssh://git@gitlabssh.intranet.bb.com.br:30022/c1207435/scan-angular.git* 
- Gere o build pelo comando ***ng build --prod***
- Acesse  172.17.204.70
- Coloque o ***dist*** gerado pela etapa 2 no diretorio ***E:\httpd-2.4.39\Apache24\htdocs\scan-hm***
- copie o ***.htaccess*** de esta em ***E:\httpd-2.4.39\Apache24\htdocs*** para dentro do ***E:\httpd-2.4.39\Apache24\htdocs\scan-hm\dist\scan***

- Servico **Apache2.4**# scan-angular-development
