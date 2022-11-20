import React, { useEffect, useState } from "react";
import { Button, Input, Row, Col, Steps, Result } from "antd";
import { datamarketUrl, ipfsUrl, getExplorerUrl, humanError, } from "../util";
import { ACTIVE_CHAIN, APP_NAME, EXAMPLE_FORM, updateForm } from "../constants";
import { FileDrop } from "./FileDrop/FileDrop";
import { uploadFiles } from "../util/stor";
import { deployContract } from "../contract/dataContract";
import { useSigner } from "wagmi";
import TextArea from "antd/lib/input/TextArea";

const { Step } = Steps;

function UploadListing({network, account}) {
  const { data: signer, error: signerError, isLoading: signerLoading, refetch } = useSigner()

  useEffect(() => {
    const networkId = network?.chain?.id
    console.log('network', network)
    if (networkId) {
      refetch()
    }
  }, [network, account])

  const [data, setData] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const setDemo = () => setData({...EXAMPLE_FORM})

  const updateData = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const getActiveError = (data) => {
    if (!data.title || !data.description || !data.priceEVM) {
      return "Please provide a name, description, price for the item.";
    }

    if (!data.files || (data.files || []).length === 0) {
      return "Must add at least one file";
    }

    return undefined
  };

  const errMessage = getActiveError(data);

  const create = async () => {
    setError(undefined);

    if (errMessage) {
      setError(errMessage)
      return;
    }

    if (!signer) {
      setError(`Please connect a valid ${ACTIVE_CHAIN.name} wallet`);
      return;
    }

    setLoading(true);
    const body = { ...data };

    // Format files for upload.
    const files = (body.files || []).map((x) => {
      return x;
    });

    let res = { ...data };

    try {
      // 2) Upload files/metadata to ipfs.
      let cid = '';
      if (files && files.length > 0) {
        cid = await uploadFiles(
          files,
          res
        );
      }

      // 3) return shareable url.
      const contract = await deployContract(signer, data.title, data.description, cid, data.priceEVM, data.keywords)
      // 1) deploy base contract with metadata,

      res["datamarketUrl"] = datamarketUrl(contract.address);
      res["dataUrl"] = cid
      res["contract"] = contract.address;
      res["contractUrl"] = getExplorerUrl(contract.address);

      // Result rendered after successful doc upload + contract creation.
      setResult(res);
      updateForm(res)
    } catch (e) {
      console.error("error creating datamarket request", e);
      const message = e.reason || e.response?.message || e.message
      setError(humanError(message))
    } finally {
      setLoading(false)
    }
  };

  const getStep = () => {
    if (!!result) {
      return 2;
    } else if (!errMessage) {
      return 1;
    }
    return 0;
  };

  return (
    <div>
      <Row>
        <Col span={16}>
          <div className="create-form white boxed">
            {!result && <><h2>Create new data listing</h2>
            <a href="#" onClick={e => {
              e.preventDefault()
              setDemo()
            }}>Set demo values</a>
            <br />

            <h3 className="vertical-margin">Listing information:</h3>
            <h5>Name</h5>
            <Input
              placeholder="Name of listing"
              value={data.title}
              onChange={(e) => updateData("title", e.target.value)}
            />
            <br/>
            <br/>

            <h5>Description</h5>
            <TextArea
              aria-label="Description"
              onChange={(e) => updateData("description", e.target.value)}
              placeholder="Add any additional description on the dataset"
              prefix="Description"
              value={data.description}
            />
            <br/>
            <br/>

            <h5>Price ({ACTIVE_CHAIN.symbol})</h5>
            <Input
              placeholder="Purchase price"
              value={data.priceEVM}
              onChange={(e) => updateData("priceEVM", e.target.value)}
            />
            <br/>
            <br/>

            <h5>Keywords</h5>
            <Input
              placeholder={EXAMPLE_FORM.keywords}
              value={data.keywords}
              onChange={(e) => updateData("keywords", e.target.value)}
            />


            {/* TODO: add configurable amount of items */}
            <h3 className="vertical-margin">Upload dataset(s) for purchaseable collection</h3>
            <FileDrop
              files={data.files || []}
              setFiles={(files) => updateData("files", files)}
            />

            <Button
              type="primary"
              className="standard-button"
              onClick={create}
              disabled={loading || errMessage}
              loading={loading}
              size="large"
            >
              Create datamarket request!
            </Button>
            {!error && !result && loading && (
              <span>&nbsp;Note this may take a few moments.</span>
            )}
            <br />
            <br />
            </>}
            {error && <div className="error-text">Error: {error}</div>}
            {result && (<div>
              <Result status="success"
 title="Created datamarket request!" subTitle="Access your page and content below"/>
              <div>
                <a href={ipfsUrl(result.dataUrl)} target="_blank">
                  View files
                </a>
                <br />
                <a href={result.contractUrl} target="_blank">
                  View created contract
                </a>
                <br />
                <br />
                <p>
                  Share or post this page with potential customers
                  <br />
                  <a href={result.datamarketUrl} target="_blank">
                    View listing page
                  </a>
                </p>
              </div>
              </div>
            )}
          </div>
        </Col>
        <Col span={1}></Col>
        <Col span={7}>
          <div className="white boxed">
            <Steps
              className="standard-margin"
              direction="vertical"
              size="small"
              current={getStep()}
            >
              <Step title="Fill in fields" description="Enter required data." />
              <Step
                title={`Create ${APP_NAME} listing`}
                description="Deploys a smart contract and creates a purchase page for the dataset"
              />
              <Step
                title="Use the generated purchase page to sell your data"
                description="Others can purchase the dataset from this url"
              />
            </Steps>
          </div>
        </Col>
      </Row>
    </div>
  );
}

UploadListing.propTypes = {};

export default UploadListing;
