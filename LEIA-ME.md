# Lume

Assistente de desktop para Windows com conversa, notas, tarefas, lembretes, foco e contador de água.

## Instalar

Baixe o artefato da compilação no GitHub Actions, extraia o ZIP e execute o instalador. O instalador não inclui serviços ou modelos de IA. Para desenvolver, execute `npm install`, `npm test` e `npm start`. Gere um instalador com `npm run dist`.

## Conversa

Configure Ollama ou uma API em Configurações. O contexto recente é enviado a cada nova pergunta ao provedor e é reiniciado ao trocar de modelo ou provedor; Codex CLI e Claude Code recebem perguntas individuais. O histórico visível só é salvo quando você ativa essa opção; desligá-la remove o histórico salvo. Uma conversa restaurada é somente para consulta, não retomará o contexto da IA automaticamente. A chave de API é armazenada usando proteção do Windows.

## Comandos locais

Exemplos: “crie tarefa ligar para Ana”, “minhas tarefas”, “inicie foco de 15 minutos”, “bebi um copo de água”, “anote: comprar café” e “me lembre de pagar amanhã às 15h”. Digite “ajuda” para ver os comandos. Apenas comandos reconhecidos executam ações; outras mensagens vão para a IA selecionada. As respostas de APIs não são executadas como comandos. Codex CLI e Claude Code usam as permissões próprias desses programas; confira a configuração antes de selecioná-los.

Lembretes e temporizador notificam enquanto o Lume estiver aberto. Lembretes vencidos são verificados quando ele é aberto novamente. Sem configuração de IA, comandos locais continuam disponíveis.

## Referências

A arquitetura foi desenvolvida para este projeto, inspirada em conceitos públicos de assistentes de desktop, incluindo [Zen](https://github.com/Sufiyan-S7/Zen), [Desktop Assistant](https://github.com/neuronection/desktop-assistant) e [OpenDex](https://github.com/wassgha/opendex). Voz, controle por palavra de ativação, Spotify integrado e execução de automações externas não fazem parte desta versão.
