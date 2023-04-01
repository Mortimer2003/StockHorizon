import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";
import React, {useCallback, useEffect, useMemo, useRef, useState, CSSProperties, Fragment} from "react";
// import {uiSlice} from "../../../../modules/ui/UISlice";

const s = makeStyle(style);

interface FormProps {
    title?: string
    description?: string
    children: React.ReactNode
    onSubmitted: () => any
    style?: CSSProperties | undefined
}

const Form = (props: FormProps) => {
    return (
        <div className={s('form')} style={props.style}>
            {props.title && (
                <div className={s('form-title')}>
                    <span className={s('title')}>{props.title}</span>
                    {props.description &&
                        <span className={s('des')}>{props.description}</span>}
                </div>
            )}
            <div className={s('form-body')}>
                {props.children}
            </div>
        </div>
    )
}

export interface FormItemProps<T, K extends string> {
    prop?: K
    value: T
    onChange?: (value: T, prop: K) => any
    disabled?: boolean
    style?: CSSProperties | undefined
}

export interface FormInputProps<
    T extends string | number, K extends string> extends FormItemProps<T, K> {
    label?: string
    multiline?: boolean
    type?: 'text' | 'number' | 'password' | 'email'
    placeholder?: string
    maxLength?: number
    prefix?: string
}

const FormInput = <T extends string | number, K extends string>(
    props: FormInputProps<T, K>
) => {
    const valueType = useMemo(() => typeof props.value, [props.value]);
    const inputType = useMemo(() => {
        if(valueType === 'number') return 'number';
        return props.type ? props.type : 'text';
    },[valueType, props.type]);
    const onChange = useCallback(
        (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
            switch (valueType) {
                case 'number':
                    props.onChange?.(
                        (e.currentTarget.value ? parseInt(e.currentTarget.value) : 0) as T,
                        props.prop
                    );
                    break;
                case 'string':
                    props.onChange?.(e.currentTarget.value as T, props.prop);
                    break;
                default:
                    throw new Error('[FormInput] unsupported generic type');
            }
        },
        [props.onChange, props.prop, valueType]
    );
    return (
        <div className={s('form-input')}
        style={props.multiline ? {height: 'initial', ...props.style} : props.style}>
            <label>
                {props.label && <span className={s('label')}>{props.label}</span>}
                {!props.multiline ?
                <input className={s('input')} type={inputType} name={props.label}
                value={props.value+''} placeholder={props.placeholder} disabled={props.disabled}
                maxLength={props.maxLength} onChange={onChange} prefix={props.prefix}/> :
                <textarea className={s('textarea')} name={props.label}
                value={props.value+''} placeholder={props.placeholder} disabled={props.disabled}
                maxLength={props.maxLength} onChange={onChange} prefix={props.prefix}/>}
            </label>
        </div>
    )
}

export interface FormSelectOption {
    label: string
    value: any
    group?: string
}

interface FormSelectProps<K extends string> extends FormItemProps<any, K>{
    options: FormSelectOption[]
}

const FormSelect = <K extends string>(props: FormSelectProps<K>) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const currentItem = useMemo(
        () => props.options.find((option) => option.value === props.value),
        [props.options, props.value]
    )
    const sortedOptions = useMemo(() => {
        const list: Record<string, any> = {};
        for (const item of props.options) {
            const key = item.group ? item.group : 'default';
            list[key] = list.hasOwnProperty(key) ? [...list[key], item] : [item];
        }
        return list;
        },[props.options]);
    const onSelect = useCallback(
        (group: string, index: number) => {
            props.onChange?.(sortedOptions[group][index].value, props.prop);
        }, [props.onChange, props.prop]
    );

    return (
        <div className={s('form-select')} style={props.style}
        onClick={() => {if(props.disabled) return setIsExpanded(!isExpanded);}}>
            <div className={s('main')}>
                {currentItem && <span>{currentItem.label}</span>}
            </div>
            <div className={s('spotlight', isExpanded && 'spotlight-show')}/>
            {isExpanded && (
                <div className={s('dropdown')}>
                    {Object.keys(sortedOptions).map((group: string) => {
                        return (
                            <div className={s('dropdown-group')} key={group}>
                                {group !== 'default' && (
                                    <span className={s('dropdown-group-label')}>{group}</span>
                                )}
                                {sortedOptions[group].map(
                                    (option: FormSelectOption, index: number) => (
                                        <Fragment key={option.label}>
                                            <span className={s('dropdown-group-item')}
                                                  onClick={() => {onSelect(group, index);}}>
                                                {option.label}
                                            </span>
                                            {index < sortedOptions[group].length - 1 && (
                                                <div style={{width: '100%', borderBottom: '2px solid rgba(255,255,255,0.1)'}}/>
                                            )}
                                        </Fragment>
                                    )
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )

}

type FormCheckboxProps<K extends string> = FormItemProps<boolean, K> & {
    label: string
};

const FormCheckbox = <K extends string>(
    props: FormCheckboxProps<K>
) => {
    const onChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) : void => {
            props.onChange?.(e.currentTarget.checked, props.prop);
        },[props.onChange, props.prop]
    )
    return (
        // <input className={s('form-checkbox')}
        // style={props.style} type="checkbox" checked={props.value} disabled={props.disabled}
        // onChange={onChange}/>
        <label className={s('form-checkbox')} style={props.style}>
            <input type="checkbox" checked={props.value} disabled={props.disabled} onChange={onChange} />
            <span className={s('label')}>{props.label}</span>
        </label>
    )
}

interface FormSwitchProps<K extends string>extends FormItemProps<number, K> {
    labels?: string[]
}

const FormSwitch = <K extends string>(props: FormSwitchProps<K>) => {
    const ref = useRef<HTMLSpanElement>(null);
    const labels = useMemo(
        () => (props.labels ? props.labels : ['ON', 'OFF']),
        props.labels ? [props.labels] : []
    );
    const labelStyle = useMemo(
        () => {
            const style : React.CSSProperties = {
                width: Math.ceil(100 / labels.length) + '%'
            }; return style;
        }, [labels]
    );

    return (
        <div className={s('form-switch')} style={props.style}>
            {labels.map(
                (label: string, index: number): JSX.Element => (
                    <span key={label} ref={ref} style={{
                        ...labelStyle, color: index === props.value ? '#000000' : '#ffffff',
                        background: index === props.value ?
                            'white' : 'transparent'
                    }} onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                        e.stopPropagation(); props.onChange?.(index, props.prop);
                    }}>{label}</span>
                )
            )}
        </div>
    )
}

type FormDateTimePickerProps<K extends string> = FormItemProps<number, K>;

const FormDateTimePicker = <K extends string>(
    props: FormDateTimePickerProps<K>
) => {
    const formattedTime = useMemo(() => {
        let date = new Date(props.value);
        date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return date.toISOString().slice(0,-8);
    },[props.value]);
    const onChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>):void => {
            props.onChange?.(Date.parse(e.currentTarget.value), props.prop);
        }, [props.onChange, props.prop]
    );
    return (
        <input className={s('form-date-time-picker')}
        style={props.style} type="datetime-local" value={formattedTime}
        disabled={props.disabled} onChange={onChange}/>
    )
}

interface FormImageUploaderProps<K extends string>extends FormItemProps<Blob, K> {
    tips?: string
    radius?: string
    fit?: 'cover' | 'contain'
    imgUrl?: string | (() => Promise<string>)
    maxSize?: number
}

const FormImageUploader = <K extends string>(
    props: FormImageUploaderProps<K>
) => {
    const [imgUrl, setImgUrl] = useState<string>();
    useEffect(() => {
        if(props.imgUrl == null) return;
        if(typeof props.imgUrl == 'string') setImgUrl(props.imgUrl);
        else props.imgUrl().then((res)=> setImgUrl(res));
    },[props.imgUrl]);
    useEffect(() => {
        if(!props.value) return;
        const reader = new FileReader();
        reader.readAsDataURL(props.value);
        reader.onload = () => {
            setImgUrl(reader.result as string);
        };
    },[props.value]);

    const fileInput = useRef<any>();
    const onClick = () => !props.disabled && fileInput.current.click();
    const onChange = useCallback((e) => {
        const mb = 1024 * 1024;
        const file = e.target.files[0];
        const maxSize = props.maxSize || 5 * mb;

        // if(file.size > maxSize)
        //     uiSlice.setError(`File size must smaller than ${maxSize / mb}MB!`);
        // else props.onChange?.(file, props.prop);
    },[]);


    return <div className={s('form-image-uploader')} style={props.style}>
        <input type="file" ref={fileInput} onChange={onChange}
        style={{display: 'none'}} accept=".png, .jpg, .jpeg"/>
        {imgUrl ? (
            <img onClick={onClick} className={s('img')} style={{
                cursor: props.disabled ? 'not-allowed' : 'pointer',
                borderRadius: props.radius || '50%',
                objectFit: props.fit || 'contain'
            }} src={imgUrl}/>
        ) : (<>
            <div onClick={onClick} className={s('circle')}
                 style={{marginBottom: props.tips ? '12px' : '0'}}>
                <img className={s('logo')} src={require("./upload-icon.png")}/>
            </div>
            <span className={s('tips')}>{props.tips}</span>
        </>)}
    </div>
}


export {Form, FormInput, FormSelect, FormCheckbox, FormSwitch, FormDateTimePicker, FormImageUploader};
