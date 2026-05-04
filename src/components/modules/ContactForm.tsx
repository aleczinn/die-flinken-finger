'use client';

import { Locale } from "@/lib/locale/locales";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/TextArea";
import { FileUpload } from "@/components/ui/FileUpload";
import { t } from "@/lib/i18n";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { css } from "@/lib/utils";
import { IconSendOutline } from "@/components/icons";
import { Input } from "@/components/ui/Input";
import { required, validate, email } from "@/lib/validation";

interface ContactFormProps {
    locale: Locale
    topics: ContactFormTopic[];
    className?: string;
}

interface ContactFormTopic {
    label: string;
    value: string;
}

interface FormErrors {
    topic?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
}

export default function ContactForm({ locale, topics, className }: ContactFormProps) {
    const defaultTopic = topics.length > 0 && topics[0];
    const defaultValue = defaultTopic ? (defaultTopic.value || defaultTopic.label) : '';

    const [topic, setTopic] = useState(defaultValue ?? '');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const firstNameRef = useRef<HTMLInputElement>(null);
    const sureNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const [errors, setErrors] = useState<FormErrors>({});


    // Pro Feld eine Validate-Funktion. Wird bei Blur und bei Submit aufgerufen.
    const validators = {
        topic: () => validate(topic, required('Bitte ein Thema wählen')),
        firstName: () => validate(firstName, required('Vorname ist ein Pflichtfeld')),
        lastName: () => validate(lastName, required('Nachname ist ein Pflichtfeld')),
        email: () => validate(emailValue, required('E-Mail ist ein Pflichtfeld'), email()),
        message: () => validate(message, required('Bitte beschreiben Sie Ihr Anliegen')),
    } satisfies Record<keyof FormErrors, () => string | null>;

    const validateField = (field: keyof FormErrors) => {
        const error = validators[field]();
        setErrors((prev) => ({ ...prev, [field]: error ?? undefined }));
    };

    // Wenn der User korrigiert, sofort den Fehler entfernen — sonst bleibt
    // "ungültig" stehen, obwohl der Wert inzwischen korrekt ist
    const clearError = (field: keyof FormErrors) => {
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = () => {
        const newErrors: FormErrors = {};
        (Object.keys(validators) as (keyof FormErrors)[]).forEach((field) => {
            const error = validators[field]();
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Optional: Fokus aufs erste fehlerhafte Feld setzen
            return;
        }

        // ... Daten absenden
        console.log({ topic, firstName, lastName, email: emailValue, message, files });
    };

    return (
        <div className={css(
            'flex flex-col justify-center bg-white p-8 lg:p-12 rounded-2xl',
            className
        )}>
            <Select label={t(locale, 'contact_form.service.label')}
                    options={topics}
                    value={topic}
                    required
                    error={errors.topic}
                    onChange={setTopic}
                    placeholder={t(locale, 'contact_form.service.placeholder')}
                    className="mb-8"
            />

            <div className="flex flex-row gap-4">
                <Input ref={firstNameRef}
                       label={t(locale, 'generic.first_name')}
                       value={firstName}
                       onChange={setFirstName}
                       onBlur={() => validateField('firstName')}
                       error={errors.firstName}
                       required
                       autoComplete="name"
                />

                <Input ref={sureNameRef}
                       label={t(locale, 'generic.last_name')}
                       value={lastName}
                       onChange={setLastName}
                       onBlur={() => validateField('lastName')}
                       error={errors.lastName}
                       required
                       autoComplete="name"
                />
            </div>

            <Input ref={emailRef}
                   label={t(locale, 'generic.email.short')}
                   value={emailValue}
                   onChange={setEmailValue}
                   onBlur={() => validateField('email')}
                   error={errors.email}
                   required
                   autoComplete="email"
            />

            <Textarea label={t(locale, 'contact_form.request.label')}
                      value={message}
                      onChange={setMessage}
                      onBlur={() => validateField('message')}
                      error={errors.message}
                      name="message"
                      maxLength={2000}
                      rows={6}
                      required
                      className="mb-8"
            />

            <span className="mb-2">{t(locale, 'contact_form.documents.description')}</span>

            <FileUpload label={t(locale, 'contact_form.documents.label')}
                        description={t(locale, 'contact_form.documents.field_description')}
                        files={files}
                        onChange={setFiles}
                        accept={['image/*', '.pdf']}
                        maxSize={10 * 1024 * 1024}
                        multiple
                        name="files"
                        className="mb-8"
            />

            <span className="text-gray-70 text-sm mb-8">Wir verwenden Ihre Angaben zur Beantwortung Ihrer Anfrage. Weitere Informationen finden Sie in unseren Datenschutzhinweisen.</span>

            <Button variant="primary"
                    type="button"
                    onClick={handleSubmit}
                    iconLeft={<IconSendOutline className="w-4 h-auto" />}
            >
                {t(locale, 'contact_form.submit')}
            </Button>
        </div>
    );
}