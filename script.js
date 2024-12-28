let logic = "*-+/^%";

function sanitize(formula){
    formula = formula.replace("^", "**");
    let new_formula = formula[0];
    for(let i=1;i<formula.length;i++){
        let pass = false;
        ["*","-","+","/","^","%"].forEach((e)=>{
            if(formula[i].includes(e) || formula[i-1].includes(e)) pass = true;
        });
        if(Number.isInteger(parseInt(formula[i-1])) && Number.isNaN(parseInt(formula[i])) && !pass){
            console.log("haaa itu de");
            new_formula += "*";
        }
        new_formula += formula[i];
    }
    return new_formula;
}

console.log(sanitize("2x"));

document.getElementById('nr-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const funcInput = sanitize(document.getElementById('function').value);
    const derivInput = sanitize(document.getElementById('derivative').value);
    const initial = parseFloat(document.getElementById('initial').value);
    const tolerance = parseFloat(document.getElementById('tolerance').value);
    const maxIterations = parseInt(document.getElementById('max-iterations').value);

    const f = new Function('x', `return ${funcInput};`);
    const fPrime = new Function('x', `return ${derivInput};`);

    let x = initial;
    let error = Infinity;
    let iteration = 0;
    const resultsTable = document.getElementById('results-table').querySelector('tbody');
    resultsTable.innerHTML = '';

    while (error > tolerance && iteration < maxIterations) {
        const fx = f(x);
        const fpx = fPrime(x);

        if (fpx === 0) {
            alert('Derivative is zero, cannot continue iterations.');
            return;
        }

        const xNext = x - fx / fpx;
        error = Math.abs(xNext - x);

        const row = `<tr>
            <td>${iteration + 1}</td>
            <td>${x.toFixed(6)}</td>
            <td>${fx.toFixed(6)}</td>
            <td>${fpx.toFixed(6)}</td>
            <td>${error.toFixed(6)}</td>
        </tr>`;
        resultsTable.insertAdjacentHTML('beforeend', row);

        x = xNext;
        iteration++;
        await new Promise(r => setTimeout(r, 200));
    }

    if (error <= tolerance) {
        Swal.fire({
            title : "Proses Selesai",
            icon : "info",
            text : `Solution converged to x = ${x.toFixed(6)} in ${iteration} iterations.`
        });
    } else {
        Swal.fire({
            title : "Proses Selesai",
            icon : "error",
            text : 'Solution did not converge within the maximum number of iterations.'
        });
    }
});


let anggotaArea = document.getElementById("anggota-area");

function showAnggota(){
    anggotaArea.classList.toggle("hide");
}