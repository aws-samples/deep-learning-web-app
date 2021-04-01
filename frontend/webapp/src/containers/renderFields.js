import {Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row} from "reactstrap";
import React from "react";

export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  ARRAY_NUMBER: 'array_number',
};

export const ARRAY_NUMBER_INPUT_TYPES = {
  LENGTH: 'length',
  VALUE: 'value',
};

export const renderFields = (params) => {
  let output = [];

  for (const param of params) {
    // Check if this field should be rendered
    if(param.conditionField) {
      const dep = params.find(p => p.name === param.conditionField);
      if(dep.val !== param.conditionFieldVal){
        continue;
      }
    }

    // Only populate text fields
    if (param.type === FIELD_TYPES.TEXT || param.type === FIELD_TYPES.NUMBER) {
      output.push(
        <FormGroup row key={param.name}>
          <Label for={param.name} sm={4}>{param.text}</Label>
          <Col sm={8}>
            <Input name={param.name}
                   type={param.type}
                   onChange={e => param.updateFunction(param.name, e.target.value)}
                   value={param.val || ''}
                   placeholder={param.placeholder}
            />
          </Col>
        </FormGroup>
      );
    } else if (param.type === FIELD_TYPES.CHECKBOX) {
      output.push(
        <FormGroup row key={param.name}>
          <Label sm={4}>{param.label}</Label>
          <Col sm={8}>
            {
              param.checkboxes.map(cb => {
                return (
                  <Row key={cb.key}>
                    <Col>
                      <Label check>
                        <Input type="checkbox"
                               id={cb.key}
                               checked={cb.isChecked}
                               onChange={() => param.updateFunction(param.name, cb.key)}
                        />{' '}
                        {cb.text}
                      </Label>
                    </Col>
                  </Row>
                )
              })
            }

          </Col>
        </FormGroup>
      )
    } else if (param.type === FIELD_TYPES.SELECT) {
      output.push(
        <FormGroup row key={param.name}>
          <Label for={param.name} sm={4}>{param.label}</Label>
          <Col sm={8}>
            <Input type="select"
                   name="select"
                   id={param.name}
                   value={param.val}
                   onChange={e => param.updateFunction(param.name, e.target.value)}
            >
              {
                param.options.map(opt =>
                  <option key={opt.key}
                          value={opt.key}
                  >
                    {opt.text}
                  </option>
                )
              }
            </Input>
          </Col>
        </FormGroup>
      )
    } else if (param.type === FIELD_TYPES.ARRAY_NUMBER) {
      output.push(
        <div key={param.name}>
          <FormGroup row>
            <Label for={param.name} sm={4}>{param.label}</Label>
            <Col sm={8}>
              <Input name={param.name}
                     type="number"
                     onChange={e => param.updateFunction(param.name, {
                       type: ARRAY_NUMBER_INPUT_TYPES.LENGTH,
                       value: e.target.value,
                     })}
                     value={param.arrayLength || ''}
                     placeholder={param.placeholder}
              />
            </Col>

            <Col sm={{offset:4, size: 8}}>
            {
              param.arrayValues.map((v, index) =>
                <InputGroup size="sm" key={index}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>#{index}</InputGroupText>
                  </InputGroupAddon>
                  <Input type="number"
                         onChange={e => {
                           const val = e.target.value;
                           let parsed = '';
                           if(e.target.value) {
                             if (Number.isInteger(val)) {
                               parsed = parseInt(val, 10);
                             } else {
                               parsed = parseFloat(val);
                             }
                           }
                           param.updateFunction(param.name, {
                             type: ARRAY_NUMBER_INPUT_TYPES.VALUE,
                             index: index,
                             value: parsed,
                           })
                         }}

                         value={param.arrayValues[index]}
                         placeholder={param.placeholder}
                  />
                </InputGroup>
              )
            }
            </Col>
          </FormGroup>
        </div>
      )
    }
  }
  return output;
};
