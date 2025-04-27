Installatie instructies:
-Installeer NodeJS 22: https://nodejs.org/en
-typ deze commando's in de terminal. Doe dit in de map van de server:
  npm init -y
  npm install langchain @langchain/core @langchain/openai
-Installeer hierna de volgende twee commando's om te kunnen werken met Express:
  npm install express
  npm install cors
-Installeer daarna de paketten die nodig zijn om te kunnen werken met vectordata:
  npm install @langchain/openai @langchain/community @langchain/core @langchain/textsplitters faiss-node
