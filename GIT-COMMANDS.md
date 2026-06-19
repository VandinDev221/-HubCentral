# Comandos para corrigir o Git e subir no repositório

## Problema
O Git está rastreando arquivos dentro de `node_modules/` (provavelmente de um commit antigo).  
Por isso as alterações aparecem como "modified" em `node_modules/@hub-central/...` e não em `apps/`.  
O `.gitignore` já tem `node_modules/`, mas arquivos que foram commitados antes continuam rastreados.

## Solução (rode no PowerShell, na pasta hub-central)

### 1. Parar de rastrear `node_modules` (não apaga a pasta no disco)
```powershell
cd c:\xampp\htdocs\project\design\hub-central
git rm -r --cached node_modules
```

### 2. Ver o status
```powershell
git status
```
Você deve ver muitas "deleted" (removidas do índice) e só **não** adicione `apps/api/.env`.

### 3. Commitar a limpeza
```powershell
git add -A
git restore --staged apps/api/.env
git status
git commit -m "chore: deixa de rastrear node_modules (respeitar .gitignore)"
```

### 4. Enviar para o GitHub
```powershell
git push origin main
```

A partir daí, o Git só vai considerar alterações em `apps/` e na raiz (por exemplo `package.json`, `package-lock.json`), e o `node_modules` ficará sempre ignorado.

**Importante:** não faça `git add apps/api/.env` — esse arquivo tem segredos e não deve ir para o repositório.
