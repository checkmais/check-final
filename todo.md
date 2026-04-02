# Check+ Vistorias - TODO

## Fase 1: Estrutura e Navegação
- [x] Configurar navegação com Expo Router (telas principais)
- [x] Criar tela inicial com dois botões de tipo de vistoria
- [x] Implementar tab bar com navegação entre seções

## Fase 2: Telas de Entrada de Dados
- [x] Tela de dados do cliente (nome, endereço, CEP, email, telefone)
- [x] Tela de dados do inspetor (nome, CPF/CNPJ, endereço, CEP, email, telefone)
- [x] Campos condicionais para Vistoria Técnica (CREA, CAU)
- [x] Validação de campos obrigatórios
- [x] Tela de condições da vistoria (data, hora, clima, acesso, iluminação, ocupação)

## Fase 3: Sistema de Fotos e GPS
- [x] Integração com câmera (expo-camera)
- [x] Captura de GPS automaticamente (expo-location)
- [x] Timestamp automático em cada foto
- [x] Fallback gracioso se GPS indisponível
- [x] Armazenamento de fotos no filesystem local
- [x] Vinculação de fotos ao item + status

## Fase 4: Checklist de Itens
- [x] Tela de itens de vistoria (placeholder inicial)
- [ ] Componente de item com status (Aprovado/Reprovado/NA)
- [ ] Galeria de fotos por item
- [ ] Campo de descrição/notas
- [ ] Validação: se "Reprovado", exigir pelo menos 1 foto
- [ ] Preparar estrutura para futuros itens dinâmicos

## Fase 5: Armazenamento Local
- [x] Implementar AsyncStorage para dados estruturados
- [x] Implementar FileSystem para fotos e arquivos
- [x] Criar estrutura de pasta: vistoria_tipo_nomecliente_data
- [ ] Auto-save de dados durante preenchimento
- [ ] Permitir múltiplas vistorias armazenadas
- [ ] Permitir reabertura e edição de vistorias

## Fase 6: Tela de Resumo e Finalização
- [x] Tela de resumo editável com todas as seções
- [x] Seções expansíveis (cliente, inspetor, condições, itens)
- [x] Botão "Finalizar Vistoria"
- [x] Opção de editar cada seção

## Fase 7: Exportação e Compartilhamento
- [x] Geração de PDF com estrutura completa
- [x] PDF: capa, introdução, dados do cliente, relatório, seção técnica, assinatura
- [x] Exportar pasta de fotos com metadados
- [x] Nomenclatura de fotos: item-status-date.jpg
- [x] Incluir arquivo JSON/TXT com metadados de cada foto
- [x] Botões de exportação: PDF, Fotos, Compartilhar Tudo
- [x] Integração com sistema de compartilhamento nativo

## Fase 8: Gerenciamento de Vistorias
- [ ] Tela "Minhas Vistorias" com histórico
- [ ] Listar vistorias salvas (data, cliente, tipo)
- [ ] Funcionalidades: visualizar, editar, deletar, compartilhar
- [ ] Busca/filtro por data ou cliente

## Fase 9: Branding e Configuração
- [x] Gerar logo/ícone do app
- [x] Atualizar app.config.ts com branding
- [x] Copiar ícone para todos os locais necessários

## Fase 10: Testes e Ajustes
- [ ] Testar fluxo completo de vistoria técnica
- [ ] Testar fluxo completo de entrega de chaves
- [ ] Validar captura de GPS e timestamp
- [ ] Validar geração de PDF
- [ ] Testar compartilhamento de arquivos
- [ ] Testar funcionamento offline
- [ ] Ajustes de UI/UX conforme feedback

## Fase 10: Build e Entrega
- [ ] Gerar logo/ícone do app
- [ ] Atualizar app.config.ts com branding
- [ ] Criar build APK
- [ ] Testar APK em dispositivo Android
- [ ] Documentação final e instruções de uso


## Correções e Melhorias (Feedback do Usuário)
- [x] Atualizar logo do app com logo profissional Check+
- [x] Reformular campos de endereço (rua, número, complemento, bairro, município, estado)
- [x] Adicionar máscara de CPF padrão (000.000.000-00)
- [x] Trocar "Inspetor" por "Vistoriador" em todo o app
- [x] Adicionar botões de edição na página de resumo
- [x] Adicionar histórico de vistorias na tela inicial
- [x] Debugar e corrigir erro de salvamento
- [x] Testar fluxo completo de vistoria
- [x] Implementar máscara de CPF com testes unitários (11 testes passando)


## Melhorias de UX e Correções (Novo Feedback)
- [x] Corrigir logo do app (logo profissional Check+ instalado)
- [x] Tornar endereço do vistoriador opcional
- [x] CPF/CNPJ flexível (aceitar ambos)
- [x] CREA ou CAU (não ambos obrigatórios para técnica)
- [x] Corrigir scroll da página de dados (keyboardShouldPersistTaps adicionado)
- [x] Adicionar notificações de sucesso ao editar (Toast component)
- [x] Melhorar UX na navegação (haptics e feedback visual)
- [x] Debugar erro ao finalizar vistoria (corrigido em storage-service)
- [x] Gerar HTML/PDF automaticamente ao finalizar (corrigido em pdf-service)


## Fase 11: Página de Vistoria Dinâmica (Novo)
- [x] Criar estrutura de dados para checklist de vistoria
- [x] Implementar página de seleção de cômodo (manual + sugestões)
- [x] Implementar seleção de tipo de área (Interna/Externa)
- [x] Implementar checklist expansível com testes
- [x] Adicionar opção NA para itens inexistentes
- [x] Implementar captura de fotos com legendas
- [x] Permitir múltiplas fotos por teste reprovado
- [ ] Integrar com contexto de inspeção
- [x] Botão para adicionar novo cômodo ou encerrar vistoria


## Melhorias de Branding
- [x] Substituir ícones genéricos pela logo Check+ nas telas de tipo de vistoria
- [x] Corrigir splash screen com logo Check+
- [x] Gerar relatório PDF de exemplo com vistoria fictícia


## Correções de Bugs (Novo Feedback)
- [x] Upload de logo Check+ para CDN
- [x] Atualizar logoUrl em app.config.ts
- [x] Adicionar suporte a CPF/CNPJ para cliente e vistoriador
- [x] Adicionar suporte a Nome/Razão Social
- [x] Corrigir referências a cpf em todos os arquivos


## Fase 12: Suporte para 3 Tipos de Vistoria (Novo)
- [x] Adicionar terceiro botão "Vistoria Simples" na tela inicial
- [x] Renomear "Vistoria Técnica" para "Vistoria Técnica" (manter como está)
- [x] Renomear "Entrega de Chaves" para "Vistoria para Locação"
- [x] Implementar fluxo de Vistoria Simples (sem campos técnicos)
- [x] Implementar fluxo de Vistoria Técnica (com CREA/ART/parecer)
- [x] Implementar fluxo de Vistoria para Locação (com estado/descrição/foto obrigatória)
- [ ] Adicionar responsável/data/assinatura em todos os tipos


## Correções de Dados da Vistoria (Novo)
- [x] Remover obrigatoriedade de todos os campos (deixar opcional)
- [x] Melhorar visual da tela de dados
- [x] Corrigir campo Cidade (flex-1 está errado)
- [x] Pré-estabelecer UF com valor padrão (SP)
- [x] Reconfigurar máscara CPF/CNPJ para aceitar ambos corretamente


## Correções Urgentes (Novo)
- [x] Transformar UF em Picker/Select com lista de estados (RJ, SP, MG, etc)
- [x] Investigar por que não aparece nada após clicar em "Próximo" na tela de dados
