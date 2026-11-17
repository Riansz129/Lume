# Lume - projeto e gera��o do instalador

O Lume possui configura��o para gerar um instalador Windows x64. O instalador inclui o aplicativo e o Electron, cria atalhos e permite escolher a pasta. Depois de gerado, o usu�rio final n�o precisa instalar Node.js nem executar comandos para usar as fun��es b�sicas.

## Gerar instalador automaticamente pelo GitHub

1. Crie um reposit�rio no GitHub e envie o conte�do desta pasta, incluindo a pasta oculta `.github`.
2. Abra a aba **Actions**, selecione **Gerar instalador Windows** e clique em **Run workflow**. Habilite Actions se for solicitado.
3. Aguarde a execu��o concluir e baixe o arquivo **Lume-Instalador-Windows** na se��o Artifacts. Extraia o ZIP do GitHub para obter o `Lume-Setup-...exe`.
4. Abra o instalador, avance nas telas e conclua a instala��o.

Os artefatos do GitHub Actions t�m prazo de reten��o e podem exigir login para download. Este fluxo n�o publica uma vers�o nem assina digitalmente o instalador. O Windows pode exibir um alerta para aplicativo sem assinatura; para distribui��o ampla � necess�rio testar e assinar o execut�vel.

## Gerar em seu computador

Instale o Node.js LTS e execute `npm install` e `npm run dist` nesta pasta. O instalador ser� criado em `dist`.

## IA local

Tarefas, notas e temporizador funcionam sem configurar uma IA. Para conversar com o Lume, � necess�rio instalar e iniciar o Ollama (https://ollama.com/download), baixar um modelo como `llama3.2` e informar o nome em Configura��es. O instalador n�o inclui o Ollama ou modelos de IA. Cada pergunta � enviada separadamente, sem hist�rico.

O atalho Ctrl+Shift+Espa�o oculta ou mostra o aplicativo. O temporizador s� notifica enquanto o aplicativo est� aberto. Voz, palavra de ativa��o, lembretes agendados, clima e controle de m�sica ainda n�o foram implementados. O bot�o Spotify abre o site.

O instalador n�o foi gerado nem testado neste ambiente, que n�o teve acesso �s depend�ncias necess�rias. Teste em um Windows limpo antes de distribuir. Este projeto � independente e n�o inclui c�digo nem marcas do Kobi.
