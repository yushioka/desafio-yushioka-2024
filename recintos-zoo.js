class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: ['macaco', 'macaco', 'macaco'] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: ['gazela'] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: ['le�o'] }
        ];
        
        this.animais = {
            'le�o': { tamanho: 3, bioma: 'savana', carnivoro: true },
            'leopardo': { tamanho: 2, bioma: 'savana', carnivoro: true },
            'crocodilo': { tamanho: 3, bioma: 'rio', carnivoro: true },
            'macaco': { tamanho: 1, bioma: 'savana ou floresta', carnivoro: false },
            'gazela': { tamanho: 2, bioma: 'savana', carnivoro: false },
            'hipopotamo': { tamanho: 4, bioma: 'savana ou rio', carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        animal = animal.toLowerCase();

        if (!this.isAnimalValido(animal)) {
            return { erro: "Animal inv�lido" };
        }
        if (!this.isQuantidadeValida(quantidade)) {
            return { erro: "Quantidade inv�lida" };
        }

        const resultados = this.recintos
            .filter(recinto => this.ehRecintoAdequado(recinto, animal, quantidade))
            .map(recinto => this.formatarResultado(recinto, animal, quantidade))
            .sort((a, b) => this.compararRecintos(a, b));

        if (resultados.length === 0) {
            return { erro: "N�o h� recinto vi�vel", recintosViaveis: null };
        }

        return { recintosViaveis: resultados };
    }

    isAnimalValido(animal) {
        return !!this.animais[animal];
    }

    isQuantidadeValida(quantidade) {
        return quantidade > 0 && Number.isInteger(quantidade);
    }

    ehRecintoAdequado(recinto, animal, quantidade) {
        const animalInfo = this.animais[animal];
        const biomasPermitidos = animalInfo.bioma.split(' ou ');
    
        const biomaEhAdequado = biomaRecinto => 
            biomasPermitidos.includes(biomaRecinto) || 
            (biomaRecinto === 'savana e rio' && biomasPermitidos.some(b => b === 'savana' || b === 'rio'));
    
        if (!biomaEhAdequado(recinto.bioma)) {
            return false;
        }
    
        if (animal === 'crocodilo' && recinto.bioma !== 'rio') {
            return false;
        }
    
        const carn�vorosExistentes = recinto.animais.filter(a => this.animais[a].carnivoro);
        if (carn�vorosExistentes.length > 0 && animalInfo.carnivoro) {
            const especiesCarnivoros = new Set(carn�vorosExistentes.map(a => this.animais[a].bioma));
            if (especiesCarnivoros.size > 1) {
                return false;
            }
        }

        // Calcular o espa�o necess�rio e dispon�vel
        const espacoOcupado = recinto.animais.reduce((total, a) => total + this.animais[a].tamanho, 0);
        const espacoNecessario = quantidade * animalInfo.tamanho;
        let espacoDisponivel = recinto.tamanho - espacoOcupado;
    
        // Verificar se a esp�cie que estamos tentando adicionar j� est� no recinto
        const especiesExistentes = new Set(recinto.animais.map(a => a.toLowerCase()));
        const especieNova = !especiesExistentes.has(animal);
    
       if (especieNova && especiesExistentes.size > 0) {
            espacoDisponivel -= 1; // Subtrair 1 unidade de espa�o para nova esp�cie
         // Aplicar espa�o extra apenas se for uma esp�cie nova e h� outras esp�cies no recinto
        }
    
        // Se n�o houver espa�o suficiente, o recinto n�o � adequado
        if (espacoDisponivel < espacoNecessario) {
            return false;
        }
    
        return true;
    }

    formatarResultado(recinto, animal, quantidade) {
        const animalInfo = this.animais[animal];
        const espacoOcupado = recinto.animais.reduce((total, a) => total + this.animais[a].tamanho, 0);
        const espacoTotal = recinto.tamanho;
        const espacoNecessario = quantidade * animalInfo.tamanho;
        const espacoDisponivel = espacoTotal - espacoOcupado - espacoNecessario;

        return Recinto ${recinto.numero} (espa�o livre: ${espacoDisponivel} total: ${espacoTotal});
    }

    compararRecintos(a, b) {
        const numeroA = parseInt(a.match(/Recinto (\d+)/)[1]);
        const numeroB = parseInt(b.match(/Recinto (\d+)/)[1]);
        return numeroA - numeroB;
    }
}

export { RecintosZoo as RecintosZoo };