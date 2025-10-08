document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact form");
    const inputs = form.querySelectorAll("input, textarea");
    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;

    /* Vyčištění formuláře a chyb při načtení */
    form.reset();
    removeErrors();

    /* Funkce */
    /* Zobrazí chybu u konkrétního pole */
    function showFieldError(input, message) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "field-error";
        errorDiv.textContent = message;
        input.insertAdjacentElement("afterend", errorDiv);
    }

    /* Odstraní všechny chyby a resetuje třídy */
    function removeErrors() {
        form.querySelectorAll(".field-error").forEach(e => e.remove());
        inputs.forEach(input => input.classList.remove("error"));
    }

    /* Validace e-mailu */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    /* Validace formuláře */
    function validateForm() {
        let valid = true;
        inputs.forEach(input => {
            const value = input.value.trim();
            const nextError = input.nextElementSibling;
            if (nextError && nextError.classList.contains("field-error")) nextError.remove();
            input.classList.remove("error");

            if (!value) {
                showFieldError(input, "Je potřeba vyplnit toto pole");
                input.classList.add("error");
                valid = false;
            } else if (input.name === "email" && !validateEmail(value)) {
                showFieldError(input, "Zadejte platný formát e-mailu");
                input.classList.add("error");
                valid = false;
            }
        });
        return valid;
    }

    /* Změna stavu tlačítka po odeslání */
    function setSubmitResult(success) {
        if (success) {
            submitBtn.textContent = "Zpráva odeslána ✔";
            submitBtn.classList.add("btn-success");
            form.reset();
        } else {
            submitBtn.textContent = "✖ Chyba při odesílání, zkuste to, prosím, znovu.";
            submitBtn.classList.add("btn-error");
        }
    }

    /* Obsluha událostí */
    /* Odstranění chyby při psaní do pole */
    form.addEventListener("input", function (e) {
        if (e.target.matches("input, textarea") && e.target.classList.contains("error")) {
            const nextError = e.target.nextElementSibling;
            if (nextError && nextError.classList.contains("field-error")) nextError.remove();
            e.target.classList.remove("error");
        }
    });

    /* Odeslání formuláře */
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        removeErrors();

        if (!validateForm()) return;

        /* Stav tlačítka při odesílání */
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Odesílá se<span class="dot-loading"><span>.</span><span>.</span><span>.</span></span>';

        const formData = new FormData(form);

        fetch('PHPMailer/mailer.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then(res => {
            /* Trim a lowercase pro porovnání se "success" */
            const text = res.trim().toLowerCase();
            setTimeout(() => {
                if (text.includes("success")) {
                    setSubmitResult(true);
                } else {
                    setSubmitResult(false);
                    console.log("Mailer response (pro debug):", res);
                }
            }, 500);
        })
        .catch(() => {
            setTimeout(() => {
                setSubmitResult(false);
            }, 500);
        })
        .finally(() => {
            /* Návrat tlačítka do původního stavu */
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.classList.remove("btn-success", "btn-error");
                submitBtn.disabled = false;
            }, 3500);
        });
    });
});
