# Tecnologias e Padrões Usados na Versão 2 da Camada de Apresentação do Scan

- GIT
- NPM 6.9.0
- Angular 7.2.15
- TypeScript 3.2.4
- SCSS (Sass)
- HTML 5
- CSS 3

A tecnologia REST para comunicação com o servidor de dados oferece um meio leve, simples e de baixo
custo de manutenção para a obtenção de informações a serem apresentadas.

> “Representational State Transfer, abreviado como REST, não é uma tecnologia, uma biblioteca, e
> nem tampouco uma arquitetura, mas sim um modelo a ser utilizado para se projetar arquiteturas de
> software distribuído, baseadas em comunicação via rede.”
> 
> [Caelum - REST: Princípios e boas práticas](https://blog.caelum.com.br/rest-principios-e-boas-praticas/)

Os serviços da camada de apresentação implementam o conceito de injeção de dependências do Angular,
em que cada um é instanciado uma única vez e está a partir daí disponível para toda a aplicação. Um
dos usos desse conceito, por exemplo, é o de um serviço de mensageria entre os componentes para
permitir que troquem informações entre si quando da interação do usuário com objetos na tela.

> A injeção de dependências (DI) é um importante padrão de desenvolvimento de aplicações. O Angular
> tem seu próprio _framework_ de DI, que é tipicamente usado na produção de aplicações Angular para
> aumentar sua eficiência e modularidade.
> 
> [Angular - Dependency Injection in Angular](https://angular.io/guide/dependency-injection)

O SCSS, variante do Sass, é uma linguagem de estilos em cascata pré-processada que permite o uso
(e o reuso) de regras de estilo, funções e interpolações de modo a simplificar enormemente os
arquivos que resultam da identidade visual da aplicação. Ele tem a vantagem de ser uma extensão
da linguagem CSS, no sentido de que qualquer código CSS válido também é SCSS válido, o que permite
o reaproveitamento da base de estilos da versão anterior, quando apropriado.

> (...) quais os benefícios em utilizar um pré-processador CSS?
> 
> Os benefícios são muitos, desde a criação de Variáveis, Condicionais, Repetição, Imports,
> Funções, Mixins, e até Extends que possibilitam você extender propriedades, evitando a
> duplicação de código.
> Os pré-processadores facilitam a manutenção do código, além de facultar um código limpo,
> utilizando vários arquivos para organizar os códigos e realizando a importação quando for
> necessário tornando os códigos CSS mais flexíveis e reutilizáveis.
> 
> [Medium - Pré-processador CSS: Sass o que é e por onde começar?](https://medium.com/@tassiogoncalvesg/pr%C3%A9-processador-css-sass-o-que-%C3%A9-e-por-onde-come%C3%A7ar-e3daeb0f31a1)